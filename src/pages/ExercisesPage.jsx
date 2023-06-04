import { useContext, useState } from "react"
import { pageCtx } from "../pageCtx"
import { objectsAreEqual } from "../jsFunctions";
// icons
import { AiFillDelete } from "react-icons/ai";
import { MdEdit, MdEditOff } from "react-icons/md";
// components 
import { DelEditContainer, ExerciseInputFields, ConfirmMenu } from "./REUSABLE_COMPONENTS";

// exerciseObject exemple:
// {name:#, description:#, stat:#, minutes:#, seconds:#}
function allRequiredInputsAreFilled(exerciseObject) {
    if (exerciseObject === null) return false
    let flag = true
    for(const key in exerciseObject){
        const val = exerciseObject[key]
        if (key === 'stat' || key === 'description') continue // skip stat since its not required
        if (val === '') {
            flag = false
            break
        }
    }
    return flag
}

export function CreateMenu({visible, setVisible}) {
  const {appData, dispatch} = useContext(pageCtx)
  const [inputValues, setInputValues] = useState(null)

  function INPUT_VALID() {
    function exerciseAlreadyExists() {
        let flag = false
        for (let i = 0; i < appData.exercises.length; i++) {
            const exerciseName = appData.exercises[i].name;
            if(exerciseName === inputValues?.name){ flag = true }
        }
        return flag
    }
    if(
        allRequiredInputsAreFilled(inputValues) &&
        !exerciseAlreadyExists()
      ) {return true} else {return false}
  }
  function handleCancel() {
    setVisible(!visible)
    setInputValues()
  }
  function handleCreateBtn() {
    if (INPUT_VALID()) {
      setVisible(!visible)
      dispatch({type:'NEW_EXERCISE', payload:inputValues})
    } else { alert('Invalid input') }
  }

  return <div className='newExerciseMenu'
    style={{display:(visible)? 'flex' : 'none'}}
  >
    {/* the component will returrn its values in the state passed */}
    <ExerciseInputFields passedStateMethod={setInputValues} /> 
    <div className="btns">
      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handleCreateBtn}>Create</button>
    </div>
  </div> // ============================>
}

export function ExerciseData({exerciseObject}) {
  const {name, description, minutes, seconds} = exerciseObject
  const formattedSeconds =  // format the seconds to have a 0 as the left digit instead of nothing
  (seconds<10)? // example: instead of 3:5 we get 3:05
  '0' + seconds : seconds
  return <div className='exerciseData'>
    <span>{name}</span>
    <span>({minutes}:{formattedSeconds})</span>
    <span>- {description}</span>
  </div> // -------------------------->
}
export function Exercise({exerciseObject}) {
  const [menuVisible, setMenuVisible] = useState(false)
  const [newValues, setNewValues] = useState(null)
  const {dispatch} = useContext(pageCtx)
  const [confirmMenu, setConfirmMenu] = useState(null)

  function toggleEdit() { setMenuVisible(!menuVisible); setNewValues() }
  function inputValidAndNew() {
    if (
        newValues &&
        allRequiredInputsAreFilled(newValues) &&
        !objectsAreEqual(exerciseObject, newValues)
      ) {
      return true
    } else { return false }
  }
  function handleSave() {
    dispatch({
      type:'UPDATE_EXERCISE',
      payload:{
        oldExerciseName: exerciseObject.name,
        newExercise: newValues
      }
    })
  }
  function handleDelete() {
    setConfirmMenu(
      <ConfirmMenu 
        text={{
          warningText:'Are you sure you want to delete this exercise?',
          cancelBtnText:'cancel',
          confirmBtnText:'delete'
        }}
        callBackIfNo={()=> setConfirmMenu(null)}
        callBackIfYes={()=> {
          dispatch({
            type:'DELETE_EXERCISE',
            payload:exerciseObject.name
          })
          setConfirmMenu(null)
        }}
      />
    )
  }

  return <div className='exercise'>
    <DelEditContainer 
      editMenuVisibile={menuVisible}
      editMenuContent={
        <ExerciseInputFields 
          exerciseObject={exerciseObject} 
          passedStateMethod={setNewValues}
        />
      }
    >
      <ExerciseData exerciseObject={exerciseObject} />
      <div className="btns">
        {
          (inputValidAndNew())?
          <button onClick={handleSave}>save</button> : null
        }

        <button onClick={toggleEdit}>
          { (menuVisible)? <MdEditOff/> : <MdEdit/> }
        </button>
        <button onClick={handleDelete}><AiFillDelete/></button>
      </div>
    </DelEditContainer>

    {confirmMenu}

  </div> // ======================>
}

export function ExercisesList() {
  const {appData} = useContext(pageCtx)
  const [visible, setVisible] = useState(false)
  function handleCreateExercise() {
    setVisible(!visible)
  }
  const mappedExercises = appData.exercises.map((exerciseObject)=>
    (typeof exerciseObject === 'object')? // if its an object render normally
    <Exercise key={exerciseObject.name} exerciseObject={exerciseObject} />
    : // else stringify the it whatever it is 
    JSON.stringify(exerciseObject)
  )
  return <>
    <button onClick={handleCreateExercise} className="newExerciseBtn">New exercise</button>
    <div className='exercisesList dataList'>
      <CreateMenu visible={visible} setVisible={setVisible} />
      {
        (appData.exercises.length > 0)?
        mappedExercises : <p className="infoP">No exercises...</p>
      }
    </div> 
  </> 
}

export default function ExercisesPage() {
  return <div className="exercisesPage">
    <ExercisesList/>
  </div> // ===========================>
}