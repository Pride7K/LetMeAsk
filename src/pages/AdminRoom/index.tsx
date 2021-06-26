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
import checkImg from "../../assets/images/check.svg"
import answerImg from "../../assets/images/answer.svg"
import { database } from "../../services/firebase";

type RoomParams = {
  id: string;
};

type QuestionType = {
  id?: string;
  author: {
    name: string | undefined;
    avatar: string | undefined;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { questions, title } = useRoom(roomId);

  async function handleSeeAsGuest()
  {
    history.push(`/rooms/${roomId}`)
  }
  async function handleEndRoom()
  {
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    toast.success("The room has ended!")
    history.push("/")
  }

  async function handleCheckQuestionAsAnswered(questionId?:string)
  {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered:true
    } as QuestionType)
  }

  async function handleHighlightQuestion(questionId?:string)
  {
    var questionRef = await (await database.ref(`rooms/${roomId}/questions/${questionId}`).get()).val() as QuestionType
    if(questionRef && questionRef.isHighlighted)
    {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: false
      } as QuestionType)
      return;
    }
    else{
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true
      } as QuestionType)
      return;
    }
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
            <Button isOutlined onClick={handleSeeAsGuest}>See as Guest</Button>
            <Button isOutlined onClick={handleEndRoom}>Close Room</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} question(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered = {question.isAnswered}
                isHighlighted = {question.isHighlighted}
              >
                {!question.isAnswered && 
                (
                  <>
                  <button
                  type="button"
                  onClick={()=> handleCheckQuestionAsAnswered(question.id)}
                  >
                  <img src={checkImg} alt="Mark As Answered" />
                  </button>
                  <button
                  type="button"
                  onClick={()=> handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Highlight Question" />
                  </button>
                  </>
                  )}
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
