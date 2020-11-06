import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Section, ImageBackground, Text, Row, TitleBar } from '@src/components';
import Transaction from '@src/components/organisms/transaction/Transaction';
import { connect } from 'react-redux';
import store from '@src/store';

const styles = StyleSheet.create({
});

type Props = {};

type State = {};

class History extends Component<Props, State> {
    state = {};

    componentDidMount() {
		store.dispatchAction({ type: 'account/loadTransactions' });
		this.props.dataManager.reset();
    }

    render() {
        const { dataManager } = this.props;
		const {} = this.state;
		const transactions = dataManager.data;

        return (
            <ImageBackground name="tanker" dataManager={dataManager}>
                <TitleBar theme="light" title="Transactions" />
                <Section type="list" isScrollable>
                    {transactions &&
                        transactions.map(tx => {
                            return <Transaction transaction={tx} />;
                        })}
                </Section>
            </ImageBackground>
        );
    }
}

export default connect(state => ({
	dataManager: state.account.transactionListManager,
}))(History);
