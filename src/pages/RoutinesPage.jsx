import { useContext, useEffect, useRef, useState } from "react"
import { pageCtx } from "../pageCtx.JSX"
import { AiFillDelete } from "react-icons/ai";
import { MdEdit} from "react-icons/md";
import { ConfirmMenu } from "./REUSABLE_COMPONENTS";


function RoutineExerciseData({routineObject}) {
  const {name, exercises} = routineObject
  let count = 0
  return <div className='routineExerciseData'>
      {
        exercises.map((exercise)=> {
          count++
          return <span key={exercise}
            style={{backgroundColor:(count % 2 == 0)? 'gainsboro' : null}}
          >
            <b>
              {(count < 10)?0:null}{count}
            </b> {exercise}
          </span>
        }
        )
      }
  </div> // =========================>
}
function Routine({routineObject}) {
  const {name} = routineObject
  return <div className='routine'>
    <div className="overview">
      <h2>{name}</h2>
      <button>Set as Active Routine</button>
      <button><MdEdit/></button>
      <button><AiFillDelete/></button>
    </div>
    <RoutineExerciseData routineObject={routineObject} />
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
  </div> // ===================================>
}
function NewRoutineMenu({visible}) {
  const {appData} = useContext(pageCtx)
  return <div className="modal">
    <div className='newRoutineMenu'>
      <div className="nameInput">
        <label>Routine name:</label>
        <input type="text" placeholder="Routine name"/>
      </div>

      <div className="edit">
        <div className="routineContents">
          <h4><u>Routine contents</u></h4>
          <ul>
            MAP SOMETING HERE
          </ul>
        </div>

        <div className="exercisesList">
          <h4><u>Exercises</u></h4>
            <ul>
              {
                appData.exercises.map((exercise)=>
                  <li className="exercise">
                    <button>add</button>
                    <span>{exercise.name}</span>
                  </li>
                )
              }
            </ul>
        </div>
      </div>

      <div className="btns">
        <button>Cancel</button>
        <button>Create</button>
      </div>

    </div> 
  </div> // ===================>
}
export default function RoutinesPage() {
  const [visible, setVisible] = useState(false)
  function openMenu() {
    setVisible(!visible)
  }
  return <div className='routinesPage'>
    <button className="newRoutineBtn" onClick={openMenu}>New routine</button>
    <NewRoutineMenu visible={visible} />
    <RoutinesList />
  </div> // ==========================>
}