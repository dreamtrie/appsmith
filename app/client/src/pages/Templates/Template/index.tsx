import React from "react";
import styled from "styled-components";
import { Template as TemplateInterface } from "api/TemplatesApi";
import history from "utils/history";
import Button, { Size } from "components/ads/Button";
import { TEMPLATE_ID_URL } from "constants/routes";
import TemplateSampleImage from "./template-test.png";
import LargeTemplate from "./LargeTemplate";

const TemplateWrapper = styled.div`
  border: 1px solid #e7e7e7;
  margin-bottom: 32px;
  transition: all 1s ease-out;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 20px 24px -4px rgba(16, 24, 40, 0.1),
      0px 8px 8px -4px rgba(16, 24, 40, 0.04);
  }
`;

const ImageWrapper = styled.div`
  padding: 20px 24px;
  overflow: hidden;
`;

const StyledImage = styled.img`
  box-shadow: 0px 17.52px 24.82px rgba(0, 0, 0, 0.09);
  object-fit: cover;
`;

const TemplateContent = styled.div`
  border-top: 0.73px solid #e7e7e7;
  padding: 16px 25px;

  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    letter-spacing: -0.24px;
    color: #191919;
  }
  .categories {
    font-weight: 500;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: -0.24px;
    color: #393939;
    margin-top: 4px;
  }
  .description {
    margin-top: 6px;
  }
`;

const TemplateContentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 17px;
`;

const DatasourceChip = styled.div`
  background-color: rgba(248, 248, 248, 0.5);
  border: 1px solid #e7e7e7;
  padding: 4px 9px;
  display: inline-flex;
  align-items: center;
  .image {
    height: 15px;
    width: 15px;
    display: inline-block;
  }
  span {
    margin-left: 6px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: -0.221538px;
    color: #191919;
  }
`;

const StyledButton = styled(Button)`
  border-radius: 18px;
  width: 38px;
`;

export interface TemplateProps {
  template: TemplateInterface;
  size?: string;
}

const Template = (props: TemplateProps) => {
  if (props.size) {
    return <LargeTemplate {...props} />;
  } else {
    return <TemplateLayout {...props} />;
  }
};

export interface TemplateLayoutProps {
  template: TemplateInterface;
  className?: string;
}

export function TemplateLayout(props: TemplateLayoutProps) {
  const { template } = props;
  const onClick = () => {
    history.push(TEMPLATE_ID_URL("dafads2342342"));
  };

  return (
    <TemplateWrapper className={props.className} onClick={onClick}>
      <ImageWrapper>
        <StyledImage src={TemplateSampleImage} />
      </ImageWrapper>
      <TemplateContent>
        <div className="title">{template.title}</div>
        <div className="categories">{template.functions.join(" • ")}</div>
        <div className="description">{template.description}</div>
        <TemplateContentFooter>
          <DatasourceChip>
            <img
              className="image"
              src={"https://assets.appsmith.com/logo/mongodb.svg"}
            />
            <span>MongoDB</span>
          </DatasourceChip>
          <StyledButton icon={"fork"} size={Size.large} />
        </TemplateContentFooter>
      </TemplateContent>
    </TemplateWrapper>
  );
}

export default Template;
