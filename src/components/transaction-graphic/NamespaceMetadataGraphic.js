import React from 'react';
import GraphicComponent from './graphics/GraphicComponent.js';
import Arrow from './graphics/Arrow.js';
import AccountIcon from './graphics/AccountIcon.js';
import NamespaceIcon from './graphics/NamespaceIcon.js';
import CircleMetadata from './graphics/CircleMetadata.js';
import Svg, {
    Text,
} from 'react-native-svg';

export default class NamespaceMetadataGraphic extends GraphicComponent {
	constructor(props) {
		super(props);
	}

    get circleIconsToDisplay() {
		return [true];
	}

	get namespace() {
		return {
			namespaceName: this.props.namespaceName[0],
			namespaceId: this.props.targetNamespaceId
		};
	}

    render() {
        return (
            <Svg
				x={0}
				y={0}
				width={this.transactionGraphicWidth}
				height={this.transactionGraphicHeight}
				viewBox={this.transactionGraphicViewbox}
				style={this.styles.transactionGraphicSvg}
			>
				<AccountIcon
					x={this.subjectPositionX}
					y={this.subjectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					address={this.props.signerAddress}
				/>
				<NamespaceIcon
					x={this.objectPositionX}
					y={this.objectPositionY}
					width={this.subjectWidth}
					height={this.subjectHeight}
					namespace={this.namespace}
				/>
				<Arrow x={this.arrowPositionX} y={this.arrowPositionY} />
				<CircleMetadata
					x={this.getCircleIconPositionX(0)}
					y={this.circleIconPositionY}
				/>
				<Text 
					x={this.transactionTypeTextPositionX}
					y={this.transactionTypeTextPositionY}
					textAnchor="middle" 
					style={this.styles.message}
				>
					{this.transactionType}
				</Text>
			</Svg>
        );
    }
}
