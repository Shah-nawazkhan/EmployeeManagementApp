import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
	FAB,
	Card,
	Title,
	Paragraph,
	Provider as PaperProvider,
	Appbar,
} from "react-native-paper";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, {
	useAnimatedStyle,
	withSpring,
	useSharedValue,
} from "react-native-reanimated";
import { styles } from "./styles";

const HomeScreen = ({ navigation }) => {
	const [employees, setEmployees] = useState([]);
	const [search, setSearch] = useState("");
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [sortOrder, setSortOrder] = useState("asc");
	const fabScale = useSharedValue(1);
	useEffect(() => {
		const defaultEmployees = [
			{
				id: "1",
				empId: "EMP001",
				name: "Usama",
				position: "Software Engineer",
			},
			{
				id: "2",
				empId: "EMP002",
				name: "Umer",
				position: "Product Manager",
			},
			{
				id: "3",
				empId: "EMP003",
				name: "Arslan",
				position: "UI/UX Designer",
			},
		];
		setEmployees(defaultEmployees);
	}, []);
	useEffect(() => {
		const filtered = employees.filter((employee) =>
			employee.name.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredEmployees(filtered);
	}, [search, employees]);
	const handleSort = () => {
		const newOrder = sortOrder === "asc" ? "desc" : "asc";
		setSortOrder(newOrder);
		const sortedEmployees = [...employees].sort((a, b) => {
			if (newOrder === "asc") {
				return a.name.localeCompare(b.name);
			} else {
				return b.name.localeCompare(a.name);
			}
		});
		setEmployees(sortedEmployees);
	};
	const deleteEmployee = (id) => {
		const updatedEmployees = employees.filter(
			(employee) => employee.id !== id
		);
		setEmployees(updatedEmployees);
	};
	const editEmployee = (id, updatedEmployee) => {
		const updatedEmployees = employees.map((employee) =>
			employee.id === id ? updatedEmployee : employee
		);
		setEmployees(updatedEmployees);
	};
	const addEmployee = (newEmployee) => {
		if (
			employees.some((employee) => employee.empId === newEmployee.empId)
		) {
			Alert.alert("Error", "Employee with the same ID already exists.");
		} else {
			setEmployees([...employees, newEmployee]);
			navigation.goBack();
		}
	};
	const fabStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: withSpring(fabScale.value) }],
		};
	});
	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Icon
					name="people"
					size={24}
					color="white"
					style={styles.titleIcon}
				/>
				<Text style={styles.title}> Emp Management</Text>
			</View>
			<Appbar.Header style={styles.appbar}>
				<SearchBar
					placeholder="Search Employees..."
					onChangeText={setSearch}
					value={search}
					lightTheme
					containerStyle={styles.searchBarContainer}
					inputContainerStyle={styles.searchBarInputContainer}
				/>
				<Appbar.Action
					icon={() => (
						<Icon name="filter-alt" size={24} color="white" />
					)}
					onPress={handleSort}
				/>
			</Appbar.Header>
			{(filteredEmployees.length === 0 && search !== "") ||
			(employees.length === 0 && filteredEmployees.length === 0) ? (
				<View style={styles.noRecordsContainer}>
					<Text>No records found</Text>
				</View>
			) : (
				<FlatList
					data={filteredEmployees}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<Card style={styles.card}>
							<Card.Content>
								<Title>{item.name}</Title>
								<Paragraph>ID: {item.empId}</Paragraph>
								<Paragraph>Position: {item.position}</Paragraph>
							</Card.Content>
							<Card.Actions>
								<TouchableOpacity
									onPress={() =>
										navigation.navigate("Edit", {
											employee: item,
											editEmployee: editEmployee,
										})
									}
								>
									<Icon
										name="edit"
										size={24}
										color="#3498db"
										style={styles.actionIcon}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => deleteEmployee(item.id)}
								>
									<Icon
										name="delete"
										size={24}
										color="#3498db"
										style={styles.actionIcon}
									/>
								</TouchableOpacity>
							</Card.Actions>
						</Card>
					)}
					style={styles.employeeList}
				/>
			)}
			<Animated.View style={[styles.fab, fabStyle]}>
				<FAB
					icon={() => <Icon name="add" size={24} color="white" />}
					onPress={() => {
						fabScale.value = 0.8;
						navigation.navigate("Add", {
							addEmployee: addEmployee,
						});
					}}
					onStateChange={({ nativeEvent }) => {
						if (nativeEvent.state === 2) {
							fabScale.value = 1;
						}
					}}
				/>
			</Animated.View>
		</View>
	);
};
const AddEmpScreen = ({ route, navigation }) => {
	const [name, setName] = useState("");
	const [position, setPosition] = useState("");
	const [empId, setEmpId] = useState("");
	const addEmployee = () => {
		if (!empId || !name || !position) {
			Alert.alert("Error", "Please fill in all the fields.");
			return;
		}
		const existingEmployees = route.params?.employees || [];
		if (existingEmployees.some((employee) => employee.empId === empId)) {
			Alert.alert("Error", "Employee with the same ID already exists.");
		} else {
			route.params?.addEmployee({
				id: Date.now().toString(),
				empId,
				name,
				position,
			});
			navigation.goBack();
		}
	};
	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Enter Employee ID"
				value={empId}
				onChangeText={(text) => setEmpId(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder="Enter Name"
				value={name}
				onChangeText={(text) => setName(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder="Enter Position"
				value={position}
				onChangeText={(text) => setPosition(text)}
				style={styles.input}
			/>
			<Button title="Add Employee" onPress={addEmployee} />
		</View>
	);
};
const EditEmpScreen = ({ route, navigation }) => {
	const { employee, editEmployee } = route.params;
	const [empId, setEmpId] = useState(employee.empId);
	const [name, setName] = useState(employee.name);
	const [position, setPosition] = useState(employee.position);
	const saveChanges = () => {
		if (!empId || !name || !position) {
			Alert.alert("Error", "Please fill in all the fields.");
			return;
		}
		const existingEmployees = route.params?.employees || [];
		if (
			existingEmployees.some(
				(emp) => emp.id !== employee.id && emp.empId === empId
			)
		) {
			Alert.alert("Error", "Employee with the same ID already exists.");
		} else {
			editEmployee(employee.id, { ...employee, empId, name, position });
			navigation.goBack();
		}
	};
	return (
		<View style={styles.container}>
			<TextInput
				placeholder="Enter Employee ID"
				value={empId}
				onChangeText={(text) => setEmpId(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder="Enter Name"
				value={name}
				onChangeText={(text) => setName(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder="Enter Position"
				value={position}
				onChangeText={(text) => setPosition(text)}
				style={styles.input}
			/>
			<Button title="Save Changes" onPress={saveChanges} />
		</View>
	);
};
const Stack = createStackNavigator();
const App = () => {
	return (
		<PaperProvider>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomeScreen} />
					<Stack.Screen name="Add" component={AddEmpScreen} />
					<Stack.Screen name="Edit" component={EditEmpScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</PaperProvider>
	);
};
export default App;
