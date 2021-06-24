import { FormEvent, useState } from "react";
import { useParams } from "react-router";
import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button/index";
import { RoomCode } from "../../components/RoomCode/index";
import { useAuth } from "../../hooks/useAuth";
import "./styles.scss";
import toast, { Toaster } from "react-hot-toast";
import { database } from "../../services/firebase";
import { useEffect } from "react";

type RoomParams = {
  id: string;
};

type Question ={
    id?:string,
    author:{
        name:string | undefined,
        avatar:string | undefined
    }
    content:string,
    isAnswered:boolean,
    isHighlighted:boolean,
}

type FirebaseQuestions = Record<string,Question>

export function Room() {
  const [newQuestion, setNewQuestion] = useState("");
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { user } = useAuth();

  useEffect(()=>{
      const roomRef = database.ref(`rooms/${roomId}`);
      roomRef.on("value",room =>{
         const databaseRoom = room.val()
         const firebaseQuestions:FirebaseQuestions = databaseRoom.questions  ?? {} as FirebaseQuestions
         const parsedQuestions =  Object.entries(firebaseQuestions).map<Question>(([key,value]) =>{
            return {
                id:key,
                content:value.content,
                author:value.author,
                isHighlighted: value.isHighlighted,
                isAnswered: value.isAnswered
            }
         }) 
         setTitle(databaseRoom.title)
         setQuestions(parsedQuestions)
         toast.success("Loaded questions successfully") 
      })
  },[roomId])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === "") {
      toast.error("Write a question!");
      return;
    }
    if (!user) {
      toast.error("You must have to be logged in to proceed!");
    }

    const question:Question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    toast.success("Question created successfully") 
    setNewQuestion("")
}

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
            placeholder="O que você quer perguntar ?"
          ></textarea>
          <div className="form-footer">
            {user ? 
            (
            <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
            </div>) 
            :(
            <span>
              Para enviar uma pergunta, <button>faça seu login.</button>
            </span> 
            )}
            <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
