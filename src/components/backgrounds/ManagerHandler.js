import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Section, Col, LoadingAnimation } from '@src/components';

const styles = StyleSheet.create({
	root: {
		height: '100%'
	},
	content: {

	},
	hidden: {
		opacity: 0
	},
	onTop: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
	},
	buttonLight: {
		borderColor: '#fff',
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10
	},
	buttonDark: {
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 5,
		paddingVertical: 5,
		paddingHorizontal: 10
	}
});

type Theme = 'light'
	| 'dark';

interface Props {
	theme: Theme
}

type State = {};


export default class GradientBackground extends Component<Props, State> {
	state = {};

    render() {
		const { children, style = {}, theme = 'dark', dataManager = {}, componentId } = this.props;
		const {} = this.state;
		const buttonStyle = theme === 'dark' 
			? styles.buttonLight 
			: styles.buttonDark;

		return (<>
			<View style={styles.content}>
				{!dataManager.isLoading && !dataManager.isError && 
					children
				}
				{(dataManager.isLoading || dataManager.isError) && 
					<View style={styles.hidden}>
						{children}
					</View>
				}
			</View>
			<View style={styles.onTop}>
				{dataManager.isLoading && !dataManager.isError && 
					<LoadingAnimation style={style}/>
				}
				{dataManager.isError && 
					<Col justify="center" align="center" fullHeight style={style}>
						<Section type="form-item">
							<Text type="bold" theme={theme} align="center">Error</Text>
							{!!dataManager.errorMessage && <Text type="bold" theme={theme} align="center">{dataManager.errorMessage}</Text>}
							{!!dataManager.errorDescription && <Text type="regular" theme={theme} align="center">{dataManager.errorDescription}</Text>}
						</Section>
						<Section type="form-item">
							<TouchableOpacity onPress={() => dataManager.fetch()}>
								<Text theme={theme} type="bold" style={buttonStyle}>Try again</Text>
							</TouchableOpacity>
						</Section>
						{componentId && <Section type="form-item">
							<TouchableOpacity onPress={() => Router.goBack(componentId)}>
								<Text theme={theme} type="bold" style={buttonStyle}>Go back</Text>
							</TouchableOpacity>
						</Section>}
					</Col>
				}
			</View>	
        </>);
    };
}