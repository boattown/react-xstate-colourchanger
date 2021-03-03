import { MachineConfig, Action, assign, actions } from "xstate";
const { send, cancel } = actions;

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

const grammar: { [index: string]: { person?: string, day?: string, time?: string, positive?: string, negative?: string } } = {
    "John": { person: "John Appleseed" },
    "Regina": { person: "Regina Phalange" },
    "Rachel": { person: "Rachel Green" },
    "Beyonce": { person: "Beyonce Knowles" },
    "Drake": { person: "Doctor Drake Ramoray" },
    "Monday": { day: "Monday" },
    "on Monday": { day: "Monday" },
    "Tuesday": { day: "Tuesday" },
    "on Tuesday": { day: "Tuesday" },
    "Wednesday": { day: "Wednesday" },
    "on Wednesday": { day: "Wednesday" },
    "Thursday": { day: "Thursday" },
    "on Thursday": { day: "Thursday" },
    "Friday": { day: "Friday" },
    "on Friday": { day: "Friday" },
    "Saturday": { day: "Saturday" },
    "on Saturday": { day: "Saturday" },
    "Sunday": { day: "Sunday" },
    "on Sunday": { day: "Sunday" },
    "8": { time: "8:00" },
    "at 8": { time: "8:00" },
    "9": { time: "9:00" },
    "at 9": { time: "9:00" },
    "10": { time: "10:00" },
    "at 10": { time: "10:00" },
    "11": { time: "11:00" },
    "at 11": { time: "11:00" },
    "12": { time: "12:00" },
    "at 12": { time: "12:00" },
    "1": { time: "13:00" },
    "at 1": { time: "13:00" },
    "2": { time: "14:00" },
    "at 2": { time: "14:00" },
    "3": { time: "15:00" },
    "at 3": { time: "15:00" },
    "4": { time: "16:00" },
    "at 4": { time: "16:00" },
    "5": { time: "17:00" },
    "at 5": { time: "17:00" },
    "6": { time: "18:00" },
    "at 6": { time: "18:00" },
}

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
                            cond: (context) => "person" in (grammar[context.recResult] || {}),
                            actions: [assign((context) => { return { person: grammar[context.recResult].person } }), cancel('maxsp')],
                            target: "day"

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
                        RECOGNISED: [{ target: '#root.dm.help', cond: (context) => context.recResult === 'help' }, {
                            cond: (context) => "day" in (grammar[context.recResult] || {}),
                            actions: [assign((context) => { return { day: grammar[context.recResult].day } }), cancel('maxsp')],
                            target: "allday"

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
                            cond: (context) => "time" in (grammar[context.recResult] || {}),
                            actions: [assign((context) => { return { time: grammar[context.recResult].time } }), cancel('maxsp')],
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