import { MachineConfig, send, Action } from "xstate";
import { nluRequest } from "./index"
import { dmMachine } from "./dmAppointment";

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
                    entry: say("Welcome! I can help you schedule a meeting, set an alarm and add to your to do list. What would you like to do?"),
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
                    entry: say("OK. I will help you set a timer."),
                    on: { ENDSPEECH: "#root.dm" }
                }
            }
        },
        todoList: {
            initial: "prompt",
            states: {
                prompt: {
                    entry: say("OK. Let's add to your to do list!"),
                    on: {
                        ENDSPEECH: "#root.dm"
                    }
                },
            }
        }
    }
})