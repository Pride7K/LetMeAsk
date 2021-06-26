import { useHistory } from "react-router"
import illustrationImg from "../../assets/images/illustration.svg"
import logoImg from "../../assets/images/logo.svg"
import googleIconImg from "../../assets/images/google-icon.svg"
import {Button} from "../../components/Button/index"
import toast,{Toaster} from "react-hot-toast"
import { useAuth } from "../../hooks/useAuth"
import {FormEvent} from "react"
import { useState } from "react"
import { database } from "../../services/firebase"
import "../../styles/auth.scss"

export function Home(){
    const history = useHistory()

    const {user,signInWithGoogle} = useAuth()

    const [roomCode,setRoomCode] = useState("")

    async function handleCreateRoom(){
        if(!user)
        {
            await signInWithGoogle()
        }
        history.push("/rooms/new")  
    }

    async function handleJoinRoom(event:FormEvent)
    {
        event.preventDefault();

        if(roomCode.trim() === "")
        {
            toast.error("You must type a room code to join!")
            return;
        }
        
        const roomRef = await database.ref(`rooms/${roomCode}`).get()
        
        if(!roomRef.exists())
        {
            toast.error("This room does not exists!")
            return;
        }
        if(roomRef.val().endedAt)
        {
            toast.error("Room already closed!")
            return;
        }

        history.push(`/rooms/${roomCode}`)  
    }

    return(
        <div id="page-auth">
            <Toaster/>
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Create your own Q&amp;A real time Room </strong>
                <p>Clear your doubts in real time</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <button onClick={handleCreateRoom} className="createRoom">
                        <img src={googleIconImg} alt="" />
                        Create with Google
                    </button>
                    <div className="separator">Or Join in a Room</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        name="" 
                        value={roomCode}
                        onChange={event => setRoomCode(event.target.value)}
                        placeholder="Write room code"
                        id="" />
                        <Button type="submit">Join Room</Button>
                    </form>
                </div>
            </main>
        </div>
    )
}