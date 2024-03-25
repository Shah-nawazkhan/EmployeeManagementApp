import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f0f0',
	},
	titleContainer: {
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingLeft: 10,
		marginBottom: 5,
	},
	titleIcon: {
		marginRight: 10,
		color: 'green',
	},
	title: {
		color: 'green',
		fontSize: 20,
		fontWeight: 'bold',
	},
	appbar: {
		backgroundColor: 'green',
	},
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 10,
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 5,
	},
	employeeList: {
		flex: 1,
		marginTop: 10,
		paddingHorizontal: 10,
	},
	card: {
		marginBottom: 10,
		elevation: 4,
		borderRadius: 10,
	},
	actionIcon: {
		marginHorizontal: 10,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: '#3498db',
		borderRadius: 28,
	},
	searchBarContainer: {
		backgroundColor: 'transparent',
		borderTopColor: 'transparent',
		borderBottomColor: 'transparent',
		flex: 1,
	},
	searchBarInputContainer: {
		backgroundColor: '#ecf0f1',
	},
	noRecordsContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
