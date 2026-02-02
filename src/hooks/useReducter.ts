// @ts-nocheck


const tasksReducer = (state, action) => {
    switch (action.type) {
        case "setTasks":
            return {
                ...state,
                tasks: action.payload.tasks,
                const: action.payload.count,
                isLoading: false,
            }
        default:
            return state;
    }
}
export default tasksReducer