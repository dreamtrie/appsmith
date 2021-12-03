import * as React from "react";
import { Text } from "@blueprintjs/core";
import styled from "styled-components";
import { ComponentProps } from "widgets/BaseComponent";
import Interweave from "interweave";
import { UrlMatcher, EmailMatcher } from "interweave-autolink";
import {
  FontStyleTypes,
  TextSize,
  TEXT_SIZES,
} from "constants/WidgetConstants";
import { getBorderRadiusValue, getBoxShadowValue } from "widgets/WidgetUtils";
import { ButtonBorderRadius, ButtonBoxShadow } from "components/constants";
import { Color } from "constants/Colors";

export type TextAlign = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";

export const TextContainer = styled.div`
  && {
    height: 100%;
    width: 100%;
  }
`;

export const StyledText = styled(Text)<{
  scroll: boolean;
  textAlign: string;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
  fontSize?: TextSize;
  borderRadius: string;
  boxShadow?: string;

  borderColor?: Color;
  borderWidth?: number;
}>`
  height: 100%;
  overflow-y: ${(props) => (props.scroll ? "auto" : "hidden")};
  text-overflow: ellipsis;
  text-align: ${(props) => props.textAlign.toLowerCase()};
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: ${(props) => (props.scroll ? "flex-start" : "center")};
  background: ${(props) => props?.backgroundColor};
  border-radius: ${({ borderRadius }) => borderRadius};
  box-shadow: ${({ boxShadow }) => `${boxShadow}`} !important;
  border-width: ${(props) => props.borderWidth}px;
  border-color: ${(props) => props.borderColor || "transparent"};
  border-style: solid;

  color: ${(props) => props?.textColor};
  font-style: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.ITALIC) ? "italic" : ""};
  text-decoration: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.UNDERLINE) ? "underline" : ""};
  font-weight: ${(props) =>
    props?.fontStyle?.includes(FontStyleTypes.BOLD) ? "bold" : "normal"};
  font-size: ${(props) => props?.fontSize && TEXT_SIZES[props?.fontSize]};
  word-break: break-word;
  span {
    width: 100%;
    line-height: 1.2;
  }
`;

export interface TextComponentProps extends ComponentProps {
  text?: string;
  textAlign: TextAlign;
  ellipsize?: boolean;
  fontSize?: TextSize;
  isLoading: boolean;
  shouldScroll?: boolean;
  backgroundColor?: string;
  textColor?: string;
  fontStyle?: string;
  disableLink: boolean;
  borderRadius: string;
  boxShadow?: string;

  borderColor?: Color;
  borderWidth?: number;
}

class TextComponent extends React.Component<TextComponentProps> {
  render() {
    const {
      backgroundColor,
      disableLink,
      ellipsize,
      fontSize,
      fontStyle,
      text,
      textAlign,
      textColor,
    } = this.props;
    return (
      <TextContainer>
        <StyledText
          backgroundColor={backgroundColor}
          borderColor={this.props.borderColor}
          borderRadius={this.props.borderRadius}
          borderWidth={this.props.borderWidth}
          boxShadow={this.props.boxShadow}
          className={this.props.isLoading ? "bp3-skeleton" : "bp3-ui-text"}
          ellipsize={ellipsize}
          fontSize={fontSize}
          fontStyle={fontStyle}
          scroll={!!this.props.shouldScroll}
          textAlign={textAlign}
          textColor={textColor}
        >
          <Interweave
            content={text}
            matchers={
              disableLink
                ? []
                : [new EmailMatcher("email"), new UrlMatcher("url")]
            }
            newWindow
          />
        </StyledText>
      </TextContainer>
    );
  }
}

export default TextComponent;
