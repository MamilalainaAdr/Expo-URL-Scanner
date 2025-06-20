import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#C4E1E6',
		paddingHorizontal: 20,
		paddingTop: 40,
	},

	headerBar: {
		height: 60,
		width: '110%',
		marginLeft: -18,
		backgroundColor: '#2A93D5',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		elevation: 4,
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 3,
		shadowOffset: { width: 0, height: 2 },
		marginBottom: 15,
		zIndex: 1000,
	},

	logo: {
		width: 130,
		height: 50,
	},

	menuButton: {
		padding: 8,
	},

	menuIcon: {
		fontSize: 28,
	},

	menuDropdown: {
		position: 'absolute',
		width: '50%',
		top: 100,
		right: 5,
		backgroundColor: '#fff',
		borderRadius: 0,
		elevation: 5,
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 3 },
		zIndex: 1100,
	},

	overlay: {
		position: 'absolute',
		top: 40,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 200,
	},

	historyControls: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
		alignItems: 'center',
	},

	wideButton: {
		width: '60%',
	},

	trashIcon: {
		fontSize: 24,
		color: 'red',
		paddingHorizontal: 10,
	},

	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},

	input: {
		borderColor: 'gray',
		borderWidth: 1,
		padding: 10,
		backgroundColor: '#F2F2F2',
		marginBottom: 10,
	},

	error: {
		color: 'red',
		marginVertical: 10,
	},

	resultContainer: {
		marginTop: 20,
	},

	alertBox: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		backgroundColor: '#FFFDF0',
		borderRadius: 8,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},

	alertTitle: {
		fontWeight: 'bold',
		marginBottom: 5,
	},

	Detail: {
		fontSize: 15,
		fontWeight: 'bold',
	},

	detailRow: {
		flexDirection: 'row',
		marginLeft: 10,
	},

	appDescription: {
		fontSize: 18,
		color: '#333',
		textAlign: 'center',
		fontStyle: 'italic',
		marginTop: 20,
	},
});

export default styles;
