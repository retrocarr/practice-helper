import { useContext, useState } from "react"
import { pageCtx } from "../pageCtx.JSX"
import { AiFillDelete } from "react-icons/ai";
import { MdEdit, MdEditOff } from "react-icons/md";
import { DelEditContainer } from "./REUSABLE_COMPONENTS";




function RoutineData({routineObject}) {
  const {name, isActive, exercises} = routineObject
  return <div className='routineData'>
    <span>{name}</span>
    {
      exercises.map((exercise)=>
        <span key={exercise}>{exercise}</span>
      )
    }
  </div> // =========================>
}

function Routine({routineObject}) {
  return <div className='routine'>
    <DelEditContainer>
      <RoutineData routineObject={routineObject} />
      <div className="btns">
        <button>Set as active routine</button>
        <button><MdEdit/></button>
        <button><AiFillDelete/></button>
      </div>
    </DelEditContainer>
  </div> // =====================>
}




function RoutinesList() {
  const {appData} = useContext(pageCtx)
  return <div className='routinesList dataList'>
    {
      appData.routines.map((routineObject)=>
        <Routine key={routineObject.name} routineObject={routineObject} />
      )
    }
  </div> // ==========================>
}
export default function RoutinesPage() {
  return <div className='routinesPage'>
    <button className="newRoutineBtn">New routine</button>
    <RoutinesList />
  </div> // ==========================>
}