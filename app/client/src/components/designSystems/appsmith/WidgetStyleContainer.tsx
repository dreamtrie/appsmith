import React, { ReactNode } from "react";
import styled from "styled-components";
import { ContainerStyle } from "widgets/ContainerWidget/component";
import { Color } from "constants/Colors";

export enum BoxShadowTypes {
  NONE = "NONE",
  VARIANT1 = "VARIANT1",
  VARIANT2 = "VARIANT2",
  VARIANT3 = "VARIANT3",
  VARIANT4 = "VARIANT4",
  VARIANT5 = "VARIANT5",
}

export type BoxShadow = keyof typeof BoxShadowTypes;

export interface WidgetStyleContainerProps {
  widgetId: string;
  containerStyle?: ContainerStyle;
  children?: ReactNode;
  borderColor?: Color;
  borderWidth?: number;
  borderRadius?: number;
  boxShadow?: BoxShadow;
}

const WidgetStyle = styled.div<WidgetStyleContainerProps>`
  height: 100%;
  width: 100%;
  & > div {
    height: 100%;
    width: 100%;
  }
}`;

// wrapper component for apply styles on any widget boundary
function WidgetStyleContainer(props: WidgetStyleContainerProps) {
  return (
    <WidgetStyle {...props} data-testid={`container-wrapper-${props.widgetId}`}>
      <div>{props.children}</div>
    </WidgetStyle>
  );
}

export default WidgetStyleContainer;
