import {connect} from 'react-redux';
import {toggleTodo} from '../actions';
import TodoList from '../components/TodoList';
import {VisiblityFilters} from '../actions';

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case VisiblityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter (t => t.completed);
    case VisiblityFilters.SHOW_ACTIVE:
      return todos.filter (t => !t.completed);
    default:
      throw new Error ('Unknown filter: ' + filter);
  }
};

const mapStateToProps = state => ({
  todos: getVisibleTodos (state.todos, state.visibilityFilters),
});

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch (toggleTodo (id)),
});

export default connect (mapStateToProps, mapDispatchToProps) (TodoList);
