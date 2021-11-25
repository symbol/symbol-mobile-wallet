import React, { Component } from 'react';
import { BackHandler, View } from 'react-native';
import SettingsListItem from '@src/components/settings/SettingsListItem';
import { Dropdown } from '@src/components';
import translate, { languageNames } from '@src/locales/i18n';
import store from '@src/store';
import { getDropdownListFromObjct } from '@src/utils';
import { connect } from 'react-redux';
import { Router } from '@src/Router';
import { getNISNodes } from '@src/config/environment';

class SettingsNIS1NodeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: getNISNodes(props.network.type),
            isBoxOpen: false,
        };
    }

    closeModal = () => {
        this.setState({
            isBoxOpen: false,
        });
    };

    openModal = () => {
        this.setState({
            isBoxOpen: true,
        });
    };

    onSelect = node => {
        console.log(node);
        store
            .dispatchAction({
                type: 'settings/saveSetSelectedNISNode',
                payload: node,
            })
            .then(_ => {
                this.closeModal();
            });
    };

    render() {
        const { data, isBoxOpen } = this.state;
        const { selectedNISNode } = this.props.settings;
        const parsedData = data.map(data => ({
            label: data,
            value: data,
        }));
        return (
            <View>
                <Dropdown
                    list={parsedData}
                    title={translate('optin.NISNode')}
                    value={selectedNISNode}
                    onChange={this.onSelect}
                >
                    <SettingsListItem
                        title={translate('optin.NISNode')}
                        icon={require('@src/assets/icons/ic-mainnet.png')}
                        isSelector={true}
                        isDropdown={true}
                        itemValue={selectedNISNode}
                        onPress={this.openModal}
                    />
                </Dropdown>
            </View>
        );
    }
}

export default connect(state => ({
    settings: state.settings,
    network: state.network.selectedNetwork,
}))(SettingsNIS1NodeSelector);
