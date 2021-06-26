import { ReactNode } from "react"
import cx from "classnames"
import "./styles.scss"

type QuestionProps = {
    content:string;
    author:{
        name:string | undefined;
        avatar:string | undefined;
    },
    children?:ReactNode,
    isAnswered?:boolean,
    isHighlighted?:boolean
}

export function Question({
    content,
    author,
    children,
    isAnswered = false,
    isHighlighted = false
   }:QuestionProps){
    return(
        <div className={
            cx("question",
            {answered:isAnswered},
            {hightlighted:isHighlighted && !isAnswered})
            }>
            <p>
                {content}
            </p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>
                    {children}
                </div>
            </footer>
        </div>
    )
}