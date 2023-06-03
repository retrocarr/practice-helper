import { useRef } from "react"

export function ExerciseInputFields({exerciseObject, passedStateMethod}) {
  const check = (typeof exerciseObject === 'object')? true : ''
  // #region refs
  const nameRef        = useRef()
  const descriptionRef = useRef()
  const statRef        = useRef()
  const minutesRef     = useRef()
  const secondsRef     = useRef()
  // #endregion
  const fields = [
    {name:'Exercise name*',ref:nameRef       , type:'text',   defaultValue:check && exerciseObject.name},
    {name:'Description'  ,ref:descriptionRef, type:'text',   defaultValue:check && exerciseObject.description},
    {name:'Stat name'    ,ref:statRef       , type:'text',   defaultValue:check && exerciseObject.stat},
    {name:'Minutes*'      ,ref:minutesRef    , type:'number', defaultValue:check && exerciseObject.minutes},
    {name:'Seconds*'      ,ref:secondsRef    , type:'number', defaultValue:check && exerciseObject.seconds},
  ]
  function handleAnyInputChange() {
    passedStateMethod({
     name:        nameRef.current.value        ,
     description: descriptionRef.current.value ,
     stat:        statRef.current.value        ,
     minutes:     minutesRef.current.value     ,
     seconds:     secondsRef.current.value     ,
    })
  }
  return <div className='exerciseInputFields'>
    {
      fields.map((field)=>
        <div key={field.name}>
          <label>{field.name}:</label>
          <input 
            ref={field.ref} 
            type={field.type} 
            placeholder={field.name} 
            onChange={handleAnyInputChange}
            defaultValue={
              field.defaultValue
            }
          />
        </div>
      )
    }
  </div> // =================================>
}
export function DelEditContainer({children, editMenuContent, editMenuVisibile}) {
  return <div className='delEditContainer'>
    <div className="overview">
      {children}
    </div>
      {
        (editMenuVisibile)? 

        <div className="editMenu">
          {editMenuContent}
        </div>

        : null
      }

  </div> // ==============================>
}