import { Link, useHistory } from "react-router-dom"
import illustrationImg from "../../assets/images/illustration.svg"
import logoImg from "../../assets/images/logo.svg"
import "../../styles/auth.scss"
import {Button} from "../../components/Button/index"
import { useAuth } from "../../hooks/useAuth"
import { FormEvent } from "react"
import { useState } from "react"
import { database } from "../../services/firebase"

export function NewRoom(){
    const {user} = useAuth()
    const history = useHistory()
    const [newRoom,setNewRoom] = useState("")

    async function handleCreateRoom(event:FormEvent) {
        event.preventDefault()

        if(newRoom.trim() === "")
        {
            return;
        }

        const roomRef = database.ref("rooms")

        const firebaseRoom = await roomRef.push({
            title:newRoom,
            authorId:user?.id
        })

        history.push(`/rooms/${firebaseRoom.key}`)

    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Create your own Q&amp;A real time Room </strong>
                <p>Clear your doubts in real time</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <h2>Create a new Room</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        name="" 
                        placeholder="Nome da sala"
                        value={newRoom}
                        onChange={event=> setNewRoom(event.target.value)}
                        id="" />
                        <Button type="submit">Create Room</Button>
                    </form>
                    <p>
                       Do you want to join in a room? <Link to="/">Click Here</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}