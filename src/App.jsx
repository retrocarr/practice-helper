import './App.scss'
import { useState, useContext } from 'react'
// hooks
import {useUpdateAppData} from './hooks/useUpdateAppData'
import {pageCtx} from './pageCtx.JSX'
// components
import PracticePage from  './pages/PracticePage'
import RoutinesPage from  './pages/RoutinesPage'
import ExercisesPage from './pages/ExercisesPage'


const ALL_PAGES = [
  {name:'Routines', component:<RoutinesPage />},
  {name:'Exersices', component:<ExercisesPage />},
  {name:'Practice', component:<PracticePage />},
  // {name:'Stats', component:<StatsPage />}
]
function NavigationBar() {
  const {setOpenPage} = useContext(pageCtx)
  return <nav className='navigationBar'>
    {
      ALL_PAGES.map((page)=> // map the pages list to buttons
        <button key={page.name} 
        onClick={()=> setOpenPage(page.component)}
        > {page.name} </button>
      )
    }
  </nav> // ===========================>
}
function PageContiner() {
  const {openPage} = useContext(pageCtx)
  return <div className='pageContiner'>
    {openPage}
  </div> // ==========================>
}


// export default function App(){
//   const {appData} = useUpdateAppData()
//   const [editMenuVisibile, seteditMenuVisibile] = useState(true)
//   function toggleEdit() {
//     seteditMenuVisibile(!editMenuVisibile)
//   }
//   return<>
//     <DelEditContainer
//       editMenuVisibile={editMenuVisibile}
//       editMenuContent={<ExerciseInputFields/>}
//     >
//       <ExerciseData exerciseObject={appData.exercises[0]} />
//       <div className="btns">
//         <button onClick={toggleEdit}><MdEdit/></button>
//         <button><AiFillDelete/></button>
//       </div>
//     </DelEditContainer>
//   </>
// }

function App() {
  const firstPageInList = ALL_PAGES[0].component
  const [openPage, setOpenPage] = useState(firstPageInList)
  const {appData, dispatch} = useUpdateAppData()
  return <>
    <pageCtx.Provider value={{openPage, setOpenPage, appData, dispatch}}>

      <NavigationBar /> {/* <- this changes what */}
      <PageContiner />  {/* <- this displayes */}

    </pageCtx.Provider> {/* <- they both access currently open page from context */}
  </>
};export default App