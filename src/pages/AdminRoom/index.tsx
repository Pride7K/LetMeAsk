import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import logoImg from "../../assets/images/logo.svg";
import { Button } from "../../components/Button/index";
import { RoomCode } from "../../components/RoomCode/index";
import { Question } from "../../components/Question/index";
import toast,{ Toaster } from "react-hot-toast";
import "../Room/styles.scss";
import { useRoom } from "../../hooks/useRoom";
import deleteImg from "../../assets/images/delete.svg"
import { database } from "../../services/firebase";
type RoomParams = {
  id: string;
};


export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom()
  {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    toast.success("The room has ended!")
    history.push("/")
  }

  async function handleDeleteQuestion(questionId?:string)
  {
    if(window.confirm("Do you really want to remove this question ?")){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      toast.success("Removed successfully!")
    }
  }

  return (
    <div id="page-room">
      <Toaster/>
      <header>
        <div className="content">
          <img src={logoImg} alt="" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                type="button"
                onClick={()=> handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remove Question" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
