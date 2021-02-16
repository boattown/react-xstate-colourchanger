import { MachineConfig, send, Action, assign } from "xstate";
import { nluRequest } from "./index"
import { dmMachine } from "./dmAppointment";
import { resourceLimits } from "worker_threads";

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

export const dmMenu: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'init',
    states: {
        init: {
            on: {
                CLICK: 'welcome'
            }
        },
        welcome: {
            initial: "prompt",
            on: {
                RECOGNISED: {
                    target: "invoking_rasa",
                }
            },
            states: {
                prompt: {
                    entry: say("What would you like to do?"),
                    on: { ENDSPEECH: "ask" }
                },
                ask: {
                    entry: listen()
                }
            }
        },
        invoking_rasa: {
            invoke: {
                id: 'rasa',
                src: (context, event) => nluRequest(context.recResult),
                onDone: [
                    { target: "appointment", cond: (context, event) => event.data.intent["name"] === "appointments" },
                    { target: "timer", cond: (context, event) => event.data.intent["name"] === "timer" },
                    { target: "todoList", cond: (context, event) => event.data.intent["name"] === "todo_item" }],
                onError: {
                    target: 'welcome',
                }
            }


        },
        appointment: {
            ...dmMachine
        },
        timer: {
            initial: "prompt",
            states: {
                prompt: {
                    entry: say("OK. I will help you set a timer.")
                }
            }
        },
        todoList: {
            initial: "prompt",
            states: {
                prompt: {
                    entry: say("OK. Let's add to your to do list!")
                },
            }
        }
    }
})