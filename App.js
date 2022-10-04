
// import React, {useState} from 'react';
// import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
// import Task from './components/Task';

// export default function App() {
//   const [task, setTask] = useState();
//   const [taskItems, setTaskItems] = useState([]);

//   const handleAddTask = () => {
//     Keyboard.dismiss();
//     setTaskItems([...taskItems, task])
//     setTask(null);
//   }

//   const completeTask = (index) => {
//     let itemsCopy = [...taskItems];
//     itemsCopy.splice(index, 1);
//     setTaskItems(itemsCopy)
//   }

//   return (
//     <View style={styles.container}>
//       {/* Added this scroll view to enable scrolling when list gets longer than the page */}
//       <ScrollView
//         contentContainerStyle={{
//           flexGrow: 1
//         }}
//         keyboardShouldPersistTaps='handled'
//       >

//       {/* Today's Tasks */}
//       <View style={styles.tasksWrapper}>
//         <Text style={styles.sectionTitle}>Today's tasks</Text>
//         <View style={styles.items}>
//           {/* This is where the tasks will go! */}
//           {
//             taskItems.map((item, index) => {
//               return (
//                 <TouchableOpacity key={index}  onPress={() => completeTask(index)}>
//                   <Task text={item} /> 
//                 </TouchableOpacity>
//               )
//             })
//           }
//         </View>
//       </View>
        
//       </ScrollView>

//       {/* Write a task */}
//       {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.writeTaskWrapper}
//       >
//         <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
//         <TouchableOpacity onPress={() => handleAddTask()}>
//           <View style={styles.addWrapper}>
//             <Text style={styles.addText}>+</Text>
//           </View>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E8EAED',
//   },
//   tasksWrapper: {
//     paddingTop: 80,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: 'bold'
//   },
//   items: {
//     marginTop: 30,
//   },
//   writeTaskWrapper: {
//     position: 'absolute',
//     bottom: 60,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center'
//   },
//   input: {
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#FFF',
//     borderRadius: 60,
//     borderColor: '#C0C0C0',
//     borderWidth: 1,
//     width: 250,
//   },
//   addWrapper: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#FFF',
//     borderRadius: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderColor: '#C0C0C0',
//     borderWidth: 1,
//   },
//   addText: {},
// });

import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#22333B', white: '#fff'};

const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = todoId => {
    const newTodosItem = todos.map(item => {
      if (item.id == todoId) {
        return {...item, completed: true};
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = todoId => {
    const newTodosItem = todos.filter(item => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert('Confirm', 'Clear all todos?', [
      {
        text: 'Yes',
        onPress: () => setTodos([]),
      },
      {
        text: 'No',
      },
    ]);
  };

  const ListItem = ({todo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? 'line-through' : 'none',
            }}>
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View style={[styles.actionIcon, {backgroundColor: 'green'}]}>
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View style={styles.actionIcon}>
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'whitesmoke',
      }}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.primary,
          }}>
          TO-DO APP
        </Text>
        <Icon name="delete" size={35} color="red" onPress={clearAllTodos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.inputForm}>
        <View style={styles.inputContainer}>
          <TextInput
            value={textInput}
            placeholder="Add Todo"
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color="white" size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputForm: {
    position: 'absolute',
    bottom: 550,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.white,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItem: {
    top: 100,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 45,
    width: 45,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;