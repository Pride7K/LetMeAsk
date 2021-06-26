import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type FirebaseQuestions = Record<string, QuestionTypeFromFirebase>;

type QuestionType = {
  id?: string;
  author: {
    name: string | undefined;
    avatar: string | undefined;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId:string| undefined
};

type QuestionTypeFromFirebase = {
  id?: string;
  author: {
    name: string | undefined;
    avatar: string | undefined;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes?: Record<string, { authorId: string }>;
};
function compare( a:QuestionType, b:QuestionType ) {
  if ( a.likeCount < b.likeCount ){
    return 1;
  }
  if ( a.likeCount > b.likeCount ){
    return -1;
  }
  return 0;
}

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if(user)
    {
      const roomRef = database.ref(`rooms/${roomId}`);
      roomRef.on("value", (room) => {
        const databaseRoom = room.val();
        if (databaseRoom) {
          const firebaseQuestions: FirebaseQuestions =
            databaseRoom.questions ?? ({} as FirebaseQuestions);
          var parsedQuestions = Object.entries(
           firebaseQuestions
          ).map<QuestionType>(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {}).find(
                ([key,value]) => value.authorId === user?.id
              )?.[0],
            };
          });
          parsedQuestions = parsedQuestions.sort(compare)
          setTitle(databaseRoom.title);
          setQuestions(parsedQuestions);
          setAuthorId(databaseRoom.authorId);
        }
      });
  
      toast.success("Loaded questions successfully");
      return ()=>{
        roomRef.off("value")
      }
    }
  }, [roomId, user?.id]);

  return { questions, title,authorId };
}
