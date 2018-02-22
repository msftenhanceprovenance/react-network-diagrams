/**
 *  Copyright (c) 2015, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from "react";
import _ from "underscore";
import Label from "./edge-label";
//17.52(w) 25.39(d) 24.49(h)

/* An equipment is an svg rect that needs to know its width, height, and style.
It receives its x and y starting position from the parent rack element, or a
default derived from a specified offset value.

It takes a label as well in the form of a string or list of strings if multilines are desired,
*/

export default React.createClass({
    getDefaultProps() {
        return {
            yOffset: 25,
            xOffset: 25,
            //equipmentHeight: 24.49, // Expressed in inches
            //equipmentWidth: 17.52, // Expressed in Inches
            //rmu: 1, // the RMU position in the rack
            pxToInch: 10
            //widthOffset: .875
        };
    },

    render() {
        let classed = "equipment";
        let labelClassed = "equipment-label";
        let styleModifier = "normal";

        if (!_.isUndefined(this.props.classed)) {
            classed += " " + this.props.classed;
        }

        if (this.props.selected) {
            classed += " selected";
            labelClassed += "selected";
            styleModifier = "selected";
        }
        if (this.props.muted) {
            classed += " muted";
            labelClassed += "muted";
            styleModifier = "muted";
        }

        let opacity = 1.0;
        if (this.props.invisible) {
            opacity = 0.0;
        } else if (this.props.muted) {
            opacity = 0.3;
        }

        const equipmentPxHeight = this.props.equipmentHeight * this.props.pxToInch;
        // Height is 244.9 px

        const equipmentPxWidth = this.props.equipmentWidth * this.props.pxToInch;
        // Width is 175.2 px

        const posX = this.props.positionX || 25;
        const posY = this.props.positionY || 25;

        const centerX = equipmentPxWidth / 2 + posX;
        const centerY = equipmentPxHeight / 2 + posY;

        const labelOffsetX = this.props.labelOffsetX || 0;
        const labelOffsetY = this.props.labelOffsetY || 0;

        let cx;
        let cy;
        let cr = 0;

        if (this.props.labelDirection === "vertical") {
            cr = 90;
        }

        switch (this.props.labelPosition) {
            case "top":
                cx = centerX;
                cy = posY + 12;
                break;
            case "bottom":
                cx = centerX;
                cy = posY + equipmentPxHeight - 15;
                break;
            default:
                cx = centerX;
                cy = centerY;
                break;
        }

        let equipmentLabel = null;

        if (
            this.props.label &&
            (!(this.props.facing === "Front" && this.props.rackFacing === "Back") &&
                !(this.props.facing === "Back" && this.props.rackFacing === "Front"))
        ) {
            equipmentLabel = (
                <Label
                    x={cx}
                    y={cy}
                    r={cr}
                    textAnchor={this.props.textAnchor}
                    classed={labelClassed}
                    style={this.props.labelStyle[styleModifier]}
                    label={this.props.label}
                    xOffset={labelOffsetX}
                    yOffset={labelOffsetY}
                    labelPosition={this.props.labelPosition}
                />
            );
        }

        // let widthLine = null;

        let vPath = "";
        vPath += "M" + (posX + 10) + "," + (posY + 5);
        vPath += " L " + (posX + 10) + " " + (posY + equipmentPxHeight - 5);

        let hTopPath = "";
        hTopPath += "M" + (posX + 7) + "," + (posY + 5);
        hTopPath += " L " + (posX + 13) + " " + (posY + 5);

        let hBottomPath = "";
        hBottomPath += "M" + (posX + 7) + "," + (posY + equipmentPxHeight - 5);
        hBottomPath += " L " + (posX + 13) + " " + (posY + equipmentPxHeight - 5);

        const heightFill = this.props.labelStyle[styleModifier];

        let heightPath = (
            <g strokeWidth={this.props.width} stroke={heightFill.fill} opacity={opacity}>
                <path className={labelClassed} d={vPath} fill={heightFill.fill} />
                <path className={labelClassed} d={hTopPath} fill={heightFill.fill} />
                <path className={labelClassed} d={hBottomPath} fill={heightFill.fill} />
            </g>
        );

        const heightInRmu = this.props.equipmentHeight / 1.75;

        let heightLabel = (
            <Label
                x={posX + 15}
                y={centerY}
                textAnchor="begin"
                classed={labelClassed}
                style={this.props.labelStyle[styleModifier]}
                label={`${heightInRmu}U`}
                labelPosition={"center"}
            />
        );

        let backStyle = { fill: this.props.backFill, fillOpacity: "0.7" };
        if (this.props.usePattern) {
            backStyle = { fill: "url(#Pattern)" };
        }

        const frontStyle = { fill: this.props.fill };

        // default to the front view.  Only show the back view if the
        // equipment is back facing on the front of the rack,
        // or front facing on the back of the rack
        let eqStyle = frontStyle;

        if (this.props.rackFacing === "Front" && this.props.facing === "Back") {
            eqStyle = backStyle;
            heightLabel = <g />;
            heightPath = <g />;
        } else if (this.props.rackFacing === "Back" && this.props.facing === "Front") {
            eqStyle = backStyle;
            heightLabel = <g />;
            heightPath = <g />;
        }

        //const eqStyle = this.props.facing === "Front" && ? frontStyle : backStyle;);

        if (!this.props.showHeight) {
            return (
                <g onClick={this.handleClick}>
                    <g strokeWidth={this.props.width} stroke={this.props.color} opacity={opacity}>
                        <rect
                            className={classed}
                            width={equipmentPxWidth}
                            height={equipmentPxHeight}
                            x={posX}
                            y={posY}
                            style={eqStyle}
                        />
                    </g>
                    {equipmentLabel}
                </g>
            );
        } else {
            return (
                <g onClick={this.handleClick}>
                    <g strokeWidth={this.props.width} stroke={this.props.color} opacity={opacity}>
                        <rect
                            className={classed}
                            width={equipmentPxWidth}
                            height={equipmentPxHeight}
                            x={posX}
                            y={posY}
                            style={eqStyle}
                        />
                    </g>
                    {equipmentLabel}
                    {heightPath}
                    {heightLabel}
                </g>
            );
        }
    },

    handleClick(e) {
        if (this.props.onSelectionChange) {
            this.props.onSelectionChange("equipment", this.props.name);
        }
        e.stopPropagation();
    }
});
