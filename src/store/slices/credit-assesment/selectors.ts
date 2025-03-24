import { RootState } from "../../store";


// Selectors
export const selectAssesmentById = (state: RootState, id: string) => {
    return state.assesments.list.find(assesment => assesment.id === id) || null;
  };
  
  // export const selectAssesments = (uid: string | undefined) => (state: RootState) => {
  //   return state.assesments.list;
  // };

  export const selectAssesments = (state: RootState) => state.assesments.list;
