import React, { Component } from 'react';
import { View, Image, StyleSheet, Linking } from 'react-native';
import { Col, Row, Text, Trunc, Icon } from '@src/components';
import GlobalStyles from '@src/styles/GlobalStyles';
import type { TransactionModel } from '@src/storage/models/TransactionModel';

const styles = StyleSheet.create({
    transactionPreview: {
        width: '100%',
        height: 60,
        borderRadius: 6,
        marginTop: 0,
        marginBottom: 8,
        padding: 17,
        paddingTop: 8,
        backgroundColor: GlobalStyles.color.WHITE
	},
	iconContainer: {
		marginRight: 14,
	},
	amounteOutgoing: {
		color: '#b30000' 
	},
	amountIncoming: {
		color: '#1bb300' 
	},
});

type Props = {
    transaction: TransactionModel,
};

export default class Transaction extends Component<Props> {
	renderValue = value => {
		switch(value.type) {
			case 'nativeMosaicIncoming':
				return <Text type="bold" theme="light" style={styles.amountIncoming}>{value.value}</Text>;
			case 'nativeMosaicOutgoing':
				return <Text type="bold" theme="light" style={styles.amounteOutgoing}>{'-'+value.value}</Text>;
		}
	};

    render = () => {
		const { transaction } = this.props;
		let rand = Math.random();
		//transaction.transferType = rand < 0.5 ? 'outgoing' : 'incoming';
		let transactionType = transaction.type;
		let date = transaction.deadline;
		let iconName = '';
		let info = transaction.signerAddress;
		let values = [];
		//console.log(transaction)

		switch(transaction.type) {
			case 'transfer':  // TODO: replace with SDK.TransactionType.TRANSFER
				iconName = transaction.transferType === 'incoming' ? 'incoming_light' : 'outgoing_light';
				info = transaction.transferType === 'incoming' ? transaction.signerAddress : transaction.recipientAddress;

				if(transaction.otherMosaics)
					values.push({type: 'otherMosaics', value: transaction.otherMosaics});
				if(transaction.message)
					values.push({type: 'message', value: transaction.message});
				if(transaction.amount && transaction.transferType === 'incoming')
					values.push({type: 'nativeMosaicIncoming', value: transaction.amount});
				if(transaction.amount && transaction.transferType === 'outgoing')
					values.push({type: 'nativeMosaicOutgoing', value: transaction.amount});
				break;
		}
		
		
		return (
			<View style={styles.transactionPreview}>
				<Row justify="start" fullWidth>
					<Col justify="center" align="center" style={styles.iconContainer}>
						<Icon size="small" name={iconName} style={styles.icon} />
					</Col>
					<Col grow>
						<Row justify="space-between">
							<Text type="regular" theme="light">
								{transactionType}
							</Text>
							<Text type="regular" theme="light">
								{date}
							</Text>
						</Row>
						<Row justify="space-between">
							<Text type="bold" theme="light">
								<Trunc type="address">
									{info}
								</Trunc>
							</Text>
							<View style={styles.value}>
								{values.map(value => this.renderValue(value))}
							</View>
						</Row>
					</Col>
				</Row>
			</View>
		);
    }
}