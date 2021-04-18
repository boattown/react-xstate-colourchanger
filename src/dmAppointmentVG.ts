import { MachineConfig, Action, assign, actions } from "xstate";

// SRGS parser and example (logs the results to console on page load)
import { loadGrammar } from './runparser'
import { parse } from './chartparser'
import { vgGrammar } from './grammars/vgGrammar'

export const getObjects = (input: any) => {
    const gram = loadGrammar(vgGrammar)
    const prs = parse(input.split(/\s+/), gram)
    const result = prs.resultsForRule(gram.$root)[0]
    if (result.action1) {
        return [result.action1, result.object1]
    } else {
        return [result.action2, result.object2]
    }
}

const parseForm = (input: any) => {
    const gram = loadGrammar(vgGrammar)
    const prs = parse(input.split(/\s+/), gram)
    const result = prs.resultsForRule(gram.$root)[0]
    return result
}

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

const { send, cancel } = actions;

const boolgrammar: { [index: string]: { yes?: boolean, no?: boolean } } = {
    "yes": { yes: true },
    "of course": { yes: true },
    "sure": { yes: true },
    "yeah": { yes: true },
    "no": { no: false },
    "no way": { no: false },
    "nope": { no: false }
}

function promptAndAsk(prompt: string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: 'prompt',
        states: {
            prompt: {
                entry: say(prompt),
                on: { ENDSPEECH: 'ask' }
            },
            ask: {
                entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
            },
        }
    })
}

export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'init',
    states: {
        init: {
            on: {
                CLICK: 'createAppointment'
            }
        },
        createAppointment: {
            initial: 'who',
            on: {
                RECOGNISED: {
                    target: 'help',
                    cond: (context) => context.recResult === 'help'
                },
                MAXSPEECH: [{ target: 'maxspeech2', cond: (context) => context.counter === 1 },
                {
                    target: 'maxspeech3', cond: (context) => context.counter === 2
                },
                { target: "maxspeech1" }]
            },
            states: {
                hist: { type: 'history' },
                who: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' },
                        {
                            cond: (context) => parseForm(context.recResult).person && !(parseForm(context.recResult).day) && !(parseForm(context.recResult).time),
                            actions: [assign((context) => { return { person: parseForm(context.recResult).person } }), cancel('maxsp')],
                            target: "day"
                        },
                        {
                            cond: (context) => parseForm(context.recResult).person && parseForm(context.recResult).day && !(parseForm(context.recResult).time),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day, person: parseForm(context.recResult).person } }), cancel('maxsp')],
                            target: "allday"
                        },
                        {
                            cond: (context) => parseForm(context.recResult).person && parseForm(context.recResult).day && (parseForm(context.recResult).time === "all day"),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day, person: parseForm(context.recResult).person, time: parseForm(context.recResult).time } }), cancel('maxsp')],
                            target: "schedule_meeting_allday"
                        },
                        {
                            cond: (context) => parseForm(context.recResult).person && parseForm(context.recResult).day && parseForm(context.recResult).time && (parseForm(context.recResult).time !== "all day"),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day, person: parseForm(context.recResult).person, time: parseForm(context.recResult).time } }), cancel('maxsp')],
                            target: "schedule_meeting"
                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            ...promptAndAsk("Let's create an appointment! Who are you meeting with?")
                        },
                        nomatch: {
                            entry: say("Sorry I don't know them."),
                            on: { ENDSPEECH: [{ target: "prompt", actions: cancel('maxsp') }] }
                        }
                    }
                },
                day: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' },
                        {
                            cond: (context) => context.person && parseForm(context.recResult).day && !(parseForm(context.recResult).time),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day} }), cancel('maxsp')],
                            target: "allday"
                        },
                        {
                            cond: (context) => context.person && parseForm(context.recResult).day && (parseForm(context.recResult).time === "all day"),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day, time: parseForm(context.recResult).time } }), cancel('maxsp')],
                            target: "schedule_meeting_allday"
                        },
                        {
                            cond: (context) => context.person && parseForm(context.recResult).day && parseForm(context.recResult).time && (parseForm(context.recResult).time !== "all day"),
                            actions: [assign((context) => { return { day: parseForm(context.recResult).day, time: parseForm(context.recResult).time } }), cancel('maxsp')],
                            target: "schedule_meeting"
                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `OK. ${context.person}. On which day is your meeting?`
                            })),
                            on: { ENDSPEECH: "ask" }
                        },
                        ask: {
                            entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
                        },
                        nomatch: {
                            entry: say("Sorry I didn't catch that. On which day is your meeting?"),
                            on: { ENDSPEECH: [{ target: "ask", actions: cancel('maxsp') }] }
                        }

                    }
                },
                allday: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' }, {
                            cond: (context) => "yes" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "schedule_meeting_allday"

                        },
                        {
                            cond: (context) => "no" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "time"

                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `OK. ${context.day}. Will it take all day?`
                            })),
                            on: { ENDSPEECH: "ask" }
                        },
                        ask: {
                            entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
                        },
                        nomatch: {
                            entry: say("Sorry I didn't catch that. Will it take all day?"),
                            on: { ENDSPEECH: [{ target: "ask", actions: cancel('maxsp') }] }
                        }

                    }
                },
                time: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' }, {
                            cond: (context) => parseForm(context.recResult).time,
                            actions: [assign((context) => { return { time: parseForm(context.recResult).time } }), cancel('maxsp')],
                            target: "schedule_meeting"

                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `OK. What time is your meeting?`
                            })),
                            on: { ENDSPEECH: "ask" }
                        },
                        ask: {
                            entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
                        },
                        nomatch: {
                            entry: say("Sorry I didn't catch that. What time is your meeting?"),
                            on: { ENDSPEECH: [{ target: "ask", actions: cancel('maxsp') }] }
                        }

                    }
                },
                schedule_meeting_allday: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' }, {
                            cond: (context) => "yes" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "end"

                        },
                        {
                            cond: (context) => "no" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "who"

                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `Do you want me to create an appointment with ${context.person} on ${context.day}?`
                            })),
                            on: { ENDSPEECH: "ask" }
                        },
                        ask: {
                            entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
                        },
                        nomatch: {
                            entry: say("Sorry I didn't catch that"),
                            on: { ENDSPEECH: [{ target: "ask", actions: cancel('maxsp') }] }
                        }

                    }
                },
                schedule_meeting: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' }, {
                            cond: (context) => "yes" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "end"

                        },
                        {
                            cond: (context) => "no" in (boolgrammar[context.recResult] || {}),
                            actions: cancel('maxsp'),
                            target: "who"

                        },
                        { target: ".nomatch" }],
                    },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `Do you want me to create an appointment with ${context.person} on ${context.day} at ${context.time}?`
                            })),
                            on: { ENDSPEECH: "ask" }
                        },
                        ask: {
                            entry: [send('LISTEN'), send('MAXSPEECH', { delay: 4000, id: 'maxsp' })]
                        },
                        nomatch: {
                            entry: say("Sorry I didn't catch that"),
                            on: { ENDSPEECH: [{ target: "ask", actions: cancel('maxsp') }] }
                        }

                    }
                }, end: {
                    initial: "prompt",
                    states: {
                        prompt: {
                            entry: say("Your appointment has been created."),
                            on: { ENDSPEECH: "#root.dm" }
                        }
                    }
                }



            }
        },
        maxspeech1: {
            entry: say("I couldn't hear you."),
            on: {
                ENDSPEECH: [{ target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 1 },
                { target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 2 },
                { target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 3 }],
            }
        },
        maxspeech2: {
            entry: say("Are you there?"),
            on: {
                ENDSPEECH: [{ target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 1 },
                { target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 2 },
                { target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 3 }],
            }
        },
        maxspeech3: {
            entry: say("You're not even listening, I give up."),
            on: {
                ENDSPEECH: [{ target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 1 },
                { target: "#root.dm.createAppointment.hist", cond: (context) => context.counter === 2 },
                { target: "#root.dm", cond: (context) => context.counter === 3 }],
            }
        },
        help: {
            initial: "prompt",
            states: {
                prompt: {
                    entry: say("Help message."),
                    on: { ENDSPEECH: "#root.dm.createAppointment.hist" }
                }
            }
        }
    }
})

export const dmMachine2: MachineConfig<SDSContext, any, SDSEvent> = ({
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
                RECOGNISED: [{
                    actions: [assign((context) => { return { action: getObjects(context.recResult)[0] } }),
                    assign((context) => { return { object: getObjects(context.recResult)[1] } })],
                    target: "confirm"
                }]
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
        confirm: {
            entry: send((context) => ({
                type: "SPEAK",
                value: `OK. I will ${context.action} the ${context.object}.`
            })),
            on: { ENDSPEECH: "init" }
        }
    }
})