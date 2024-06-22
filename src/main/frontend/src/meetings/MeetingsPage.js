// import {useEffect, useState} from "react";
// import NewMeetingForm from "./NewMeetingForm";
// import MeetingsList from "./MeetingsList";
//
// export default function MeetingsPage({username}) {
//     const [meetings, setMeetings, ] = useState([]);
//     const [addingNewMeeting, setAddingNewMeeting] = useState(false);
//
//     useEffect(() => {
//         const fetchMeetings = async () => {
//             const response = await fetch(`/api/meetings`);
//             if (response.ok) {
//                 const meetings = await response.json();
//                 setMeetings(meetings);
//             }
//         };
//         fetchMeetings();
//     }, []);
//
//
//     async function handleNewMeeting(meeting) {
//         const response = await fetch('/api/meetings', {
//             method: 'POST',
//             body: JSON.stringify(meeting),
//             headers: { 'Content-Type': 'application/json' }
//         });
//         if (response.ok) {
//             const nextMeetings = [...meetings, meeting];
//             setMeetings(nextMeetings);
//             setAddingNewMeeting(false);
//         }
//     }
//
//
//     async function handleDeleteMeeting(meeting) {
//         const response = await fetch(`/api/meetings/${meeting.id}`, {
//             method: 'DELETE',
//         });
//         if (response.ok) {
//             const nextMeetings = meetings.filter(m => m !== meeting);
//             setMeetings(nextMeetings);
//         }
//     }
//
//
//     function handleSignIn(meeting) {
//         const nextMeetings = meetings.map(m => {
//             if (m === meeting) {
//                 m.participants = [...m.participants, username];
//             }
//             return m;
//         });
//         setMeetings(nextMeetings);
//     }
//     async function handleSignIn(meeting) {
//         const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
//             method: 'POST',
//             body: JSON.stringify({login: username}),
//             headers: {'content-type': 'application/json'}
//         });
//         if (response.ok) {
//             const newParticipants = await response.json();
//             const nextMeetings = meetings.map(m => {
//                 if (m === meeting) {
//                     m.participants = newParticipants;
//                 }
//                 return m;
//             });
//             setMeetings(nextMeetings);
//         }
//     }
//
//     async function handleSignOut(meeting) {
//         const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`, {
//             method: 'DELETE',
//         });
//         if (response.ok) {
//             const newParticipants = await response.json();
//             const nextMeetings = meetings.map(m => {
//                 if (m === meeting) {
//                     m.participants = m.participants = newParticipants;
//                 }
//                 return m;
//             });
//             setMeetings(nextMeetings);
//         }
//     }
//
//
//
//
//     // function handleSignOut(meeting) {
//     //     const nextMeetings = meetings.map(m => {
//     //         if (m === meeting) {
//     //             m.participants = m.participants.filter(u => u !== username);
//     //         }
//     //         return m;
//     //     });
//     //     setMeetings(nextMeetings);
//     // }
//
//
//
//
//     return (
//         <div>
//             <h2>Zajęcia ({meetings.length})</h2>
//             {
//                 addingNewMeeting
//                     ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
//                     : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
//             }
//             {meetings.length > 0 &&
//                 <MeetingsList meetings={meetings} username={username}
//                               onDelete={handleDeleteMeeting}
//                               onSignIn={handleSignIn}
//                               onSignOut={handleSignOut}/>}
//         </div>
//     )
// }
















import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);
    const [refreshMeetings, setResfeshMeetings] = useState(false);
    const [refreshUser,setRefreshUser] = useState(false);

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };
        fetchMeetings();
    }, [refreshMeetings]);

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {
            const nextMeetings = [...meetings, await response.json()];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        } else {
            alert("Status: " + response.status);
            setRefreshUser(!refreshMeetings);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch("/api/meetings/" + meeting.id, {
            method: 'DELETE'
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        } else {
            alert("Status: " + response.status);
            setRefreshUser(!refreshUser);
        }

    }
    async function handleSignIn(meeting) {
        // const dataToSend = [{ login: username }];
        const response = await fetch(`/api/meetings/${meeting.id}/participants/`, {
            method: 'POST',
            body: JSON.stringify({login: username}),
            headers: {'Content-Type': 'application/json'}
        });
        if (response.ok) {

        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                m.participants = [...m.participants, username];
            }
            return m;
        });
        setMeetings(nextMeetings);
    }else {
            alert("Status: " + response.status);
            setResfeshMeetings(!refreshUser);
        }
    }



    function handleSignOut(meeting) {
        const nextMeetings = meetings.map(m => {
            if (m === meeting) {
                m.participants = m.participants.filter(u => u !== username);
            }
            return m;
        });
        setMeetings(nextMeetings);
    }

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onSignIn={handleSignIn}
                              onSignOut={handleSignOut}/>}
        </div>
    )
}




/*
import {useEffect, useState} from "react";
import NewMeetingForm from "./NewMeetingForm";
import MeetingsList from "./MeetingsList";

export default function MeetingsPage({username}) {
    const [meetings, setMeetings] = useState([]);
    const [addingNewMeeting, setAddingNewMeeting] = useState(false);

    async function handleNewMeeting(meeting) {
        const response = await fetch('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meeting),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            const newMeeting = await response.json();
            const nextMeetings = [...meetings, newMeeting];
            setMeetings(nextMeetings);
            setAddingNewMeeting(false);
        }
    }

    async function handleDeleteMeeting(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const nextMeetings = meetings.filter(m => m !== meeting);
            setMeetings(nextMeetings);
        }
    }

    async function handleSignIn(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants`, {
            method: 'POST',
            body: JSON.stringify({login: username}),
            headers: {'content-type': 'application/json'}
        });
        if (response.ok) {
            const newParticipants = await response.json();
            const nextMeetings = meetings.map(m => {
                if (m === meeting) {
                    m.participants = newParticipants;
                }
                return m;
            });
            setMeetings(nextMeetings);
        }
    }

    async function handleSignOut(meeting) {
        const response = await fetch(`/api/meetings/${meeting.id}/participants/${username}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            const newParticipants = await response.json();
            const nextMeetings = meetings.map(m => {
                if (m === meeting) {
                    m.participants = m.participants = newParticipants;
                }
                return m;
            });
            setMeetings(nextMeetings);
        }
    }

    useEffect(() => {
        const fetchMeetings = async () => {
            const response = await fetch(`/api/meetings`);
            if (response.ok) {
                const meetings = await response.json();
                setMeetings(meetings);
            }
        };
        fetchMeetings();
    }, []);

    return (
        <div>
            <h2>Zajęcia ({meetings.length})</h2>
            {
                addingNewMeeting
                    ? <NewMeetingForm onSubmit={(meeting) => handleNewMeeting(meeting)}/>
                    : <button onClick={() => setAddingNewMeeting(true)}>Dodaj nowe spotkanie</button>
            }
            {meetings.length > 0 &&
                <MeetingsList meetings={meetings} username={username}
                              onDelete={handleDeleteMeeting}
                              onSignIn={handleSignIn}
                              onSignOut={handleSignOut}/>}
        </div>
    )
}
*/