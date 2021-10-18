import React, { Component } from 'react';
import translate from '@src/locales/i18n';
import GlobalStyles from '@src/styles/GlobalStyles';

class GraphicComponent extends Component {
    transactionTypeTextPositionX = 485;
    transactionTypeTextPositionY = 380;
    arrowPositionX = 341;
    arrowPositionY = 325;
    circlesIconsPositionsX = [[466], [447, 485], [428, 466, 504]];
    circleIconPositionY = 320;
    transactionGraphicViewbox ='380 240 200 170';
    transactionGraphicWidth = 370;
    transactionGraphicHeight = 110;
    subjectPositionX = 200;
    subjectPositionY = 277;
    objectPositionX = 505;
    subjectWidth = 261;
    subjectHeight = 90;

    get objectPositionY() {
        return this.subjectPositionY;
    }

    get styles() {
        return ({
            circleIcon: {
                marginHorizontal: 2
            },
            text: {
                fontSize: 18,
                fontWeight: 'bold',
                fill: GlobalStyles.color.SECONDARY
            },
            message: {
                fontSize: 16,
                fontWeight: 400,
                fill: GlobalStyles.color.BLUE
            },
            arrowBody: {
                stroke: GlobalStyles.color.SECONDARY
            },
            arrowEnd: {
                fill: GlobalStyles.color.SECONDARY
            },
            circleIconsContainer: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            },
        });
    }

    get nativeMosaicId() {
        console.log('Network', this.props.network)
        return this.props.network?.networkCurrency.mosaicId;
    }

    get nativeMosaicAliasName() {
        console.log('Network', this.props.network)
        return this.props.network?.networkCurrency.namespaceName;
    }

    get _x() {
        return this.props.x;
    }

    get _y() {
        return this.props.y;
    }

    get _height() {
        return this.props.height || 0;
    }

    get _width() {
        return this.props.width || 0;
    }

    get circlesCount() {
        return Array.isArray(this.circleIconsToDisplay)
            ? this.circleIconsToDisplay.reduce((acc, value) => acc + value)
            : 0;
    }

    get transactionType() {
        return this.getTranslation(`transactionTypes.transactionDescriptor_${this.props.transactionType}`);
    }

    getColorFromHash(hash, isHex = true) {
		const color = {
			R: 0,
			G: 0,
			B: 0
		};

		if (typeof hash !== 'string') {
			console.error('Failed to convert hash to color. Hash is not a String');
			return color;
		}
		if (hash.length < 3) {
			console.error('Failed to convert hash to color. Hash string length < 3');
			return color;
		}

		const hexToRGB = (hexString) => {
			let totalHex = 0;

			for (const hex of hexString)
				totalHex += parseInt(hex, 16);

			return Math.trunc(totalHex * 255 / (15 * hexString.length));
		};

		const charsetToRGB = (string) => {
			const charset = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

			let totalHex = 0;

			for (const char of string)
				totalHex += charset.indexOf(char.toLowerCase());

			return Math.trunc(totalHex * 255 / ((charset.length - 1) * string.length));
		};

		const hashLength = hash.length;
		const colorStrLength = Math.trunc(hashLength / 3);

		const strRed = hash.substring(0, colorStrLength);
		const strGreen = hash.substring(colorStrLength, colorStrLength * 2);
		const strBlue = hash.substring(colorStrLength * 2, colorStrLength * 3);

		color.R = isHex ? hexToRGB(strRed) : charsetToRGB(strRed.substring(2, 3));
		color.G = isHex ? hexToRGB(strGreen) : charsetToRGB(strGreen);
		color.B = isHex ? hexToRGB(strBlue) : charsetToRGB(strBlue);

		return color;
	}

    getTranslation(str) {
        return translate(str);
    }

    getPixels(value) {
        return value + 'px';
    }

    getIconColor(str) {
        const color = this.getColorFromHash(str, false);

        return `rgb(${color.R},${color.G},${color.B})`;
    }

    getIconColorFromHex(str) {
        const color = this.getColorFromHash(str, true);

        return `rgb(${color.R},${color.G},${color.B})`;
    }

    truncString(str, strLen = 4) {
        if (typeof str === 'string') {
			if (str.length > strLen * 2)
				return `${str.substring(0, strLen)}...${str.substring(str.length - strLen, str.length)}`;
			return str;
		}
		console.error('Failed to trunc string. Provided value is not a string');
		return str;
    }

    getId(id) {
        return id + '-' + Math.floor(Math.random() * Math.floor(1000));
    }

    getCircleIconPositionX(index) {
        const circlesCount = this.circlesCount;

        switch (index) {
            case 0:
                if (this.circleIconsToDisplay[0])
                    return this.circlesIconsPositionsX[circlesCount - 1][0];
            break;
            case 1:
                if (this.circleIconsToDisplay[1]) {
                    if (this.circleIconsToDisplay[0])
                        return this.circlesIconsPositionsX[circlesCount - 1][1];

                    return this.circlesIconsPositionsX[circlesCount - 1][0];
                }
            break;
            case 2:
                if (this.circleIconsToDisplay[2]) {
                    if (
                        this.circleIconsToDisplay[0] &&
                        this.circleIconsToDisplay[1]
                    )
                        return this.circlesIconsPositionsX[circlesCount - 1][2];
                    if (
                        this.circleIconsToDisplay[0] ||
                        this.circleIconsToDisplay[1]
                    )
                        return this.circlesIconsPositionsX[circlesCount - 1][1];
                    return this.circlesIconsPositionsX[circlesCount - 1][0];
                }
            break;
        }
    }

    getMosaicName(mosaic) {
        let mosaicAliasName;

		if (Array.isArray(mosaic.mosaicAliasName))
			mosaicAliasName = mosaic.mosaicAliasName.length ? mosaic.mosaicAliasName[0] : 'N/A';
		else
			mosaicAliasName = mosaic.mosaicAliasName ? mosaic.mosaicAliasName : 'N/A';

		return mosaicAliasName !== 'N/A'
			? mosaicAliasName
			: mosaic.mosaicId;
    }

    getMosaicTitle(mosaic) {
        return `Mosaic: ${this.getMosaicName(mosaic)}`;
    }

    getAddressTitle(address) {
        return `Account: ${address}`;
    }
}

 export default GraphicComponent;