import {useUpdateAppData} from '../hooks/useUpdateAppData'

export default function PracticePage() {
  const {appData, setAppData} = useUpdateAppData()
  // TODO: loop through routines and find the active one if no active one then set first one
  return <div className='practicePage'>
    {/* TODO: map the items of the active routine to this page */}
  </div> // ---------------------------
}