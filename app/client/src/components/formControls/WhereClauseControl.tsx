import React, { useEffect } from "react";
import FormControl from "pages/Editor/FormControl";
import Icon, { IconSize } from "components/ads/Icon";
import styled from "styled-components";
import { FieldArray, getFormValues } from "redux-form";
import { ControlProps } from "./BaseControl";
import _ from "lodash";
import { useSelector } from "react-redux";
import { getBindingOrConfigPathsForWhereClauseControl } from "entities/Action/actionProperties";
import { WhereClauseSubComponent } from "./utils";

const DropdownWidth = 95; //in pixel
const Margin = 8; //in pixel
const IconWidth = 12; //in pixel

// Type of the value for each condition
export type whereClauseValueType = {
  condition?: string;
  children?: [whereClauseValueType];
  key?: string;
  value?: string;
};

// Form config for the value field
const valueFieldConfig: any = {
  key: "value",
  controlType: "QUERY_DYNAMIC_INPUT_TEXT",
  placeholderText: "value",
};

// Form config for the key field
const keyFieldConfig: any = {
  key: "key",
  controlType: "QUERY_DYNAMIC_INPUT_TEXT",
  placeholderText: "key",
};

// Form config for the condition field
const conditionFieldConfig: any = {
  key: "operator",
  controlType: "DROP_DOWN",
  initialValue: "EQ",
  options: [],
};

// Form config for the operator field
const logicalFieldConfig: any = {
  key: "condition",
  controlType: "DROP_DOWN",
  initialValue: "EQ",
};

// Component for the delete Icon
const CenteredIcon = styled(Icon)<{
  alignSelf?: string;
  marginBottom?: string;
}>`
  margin-left: 4px;
  align-self: ${(props) => (props.alignSelf ? props.alignSelf : "end")};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : "10px"};
  &.hide {
    opacity: 0;
    pointer-events: none;
  }
`;

// Wrapper inside the main box, contains the dropdown and ConditionWrapper
const SecondaryBox = styled.div<{ showBorder: boolean }>`
  display: flex;
  flex-direction: row;
  position: relative;
  border: solid 1.2px var(--appsmith-color-black-400);
  width: max-content;
  border-width: ${(props) => (props?.showBorder ? "1.2px" : "0px")};
  margin: ${(props) => (props?.showBorder ? "0px 8px" : "0px")};
  padding: ${(props) => (props?.showBorder ? "8px" : "0px")};
  padding-bottom: 24px;
`;

// Wrapper to contain either a ConditionComponent or ConditionBlock
const ConditionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
`;

// Wrapper to contain a single condition statement
const ConditionBox = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 4px 0px;
  :first-child {
    margin-top: 0px;
  }
`;

// Box containing the action buttons to add more filters
const ActionBox = styled.div<{ marginLeft: string }>`
  display: flex;
  margin-top: 16px;
  flex-direction: row;
  width: max-content;
  justify-content: space-between;
  position: absolute;
  height: 24px;
  text-transform: uppercase;
  background-color: inherit;
  bottom: 0px;
  margin-left: ${(props) => props.marginLeft};
`;

// The final button to add more filters/ filter groups
const AddMoreAction = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.6px;
  color: #858282;
  margin-right: 20px;
`;

// Component to display single line of condition, includes 2 inputs and 1 dropdown
function ConditionComponent(props: any, index: number) {
  // Custom styles have to be passed as props, otherwise the UI will be disproportional

  const keyPath = getBindingOrConfigPathsForWhereClauseControl(
    props.field,
    WhereClauseSubComponent.Key,
  );
  const valuePath = getBindingOrConfigPathsForWhereClauseControl(
    props.field,
    WhereClauseSubComponent.Value,
  );
  const conditionPath = getBindingOrConfigPathsForWhereClauseControl(
    props.field,
    WhereClauseSubComponent.Condition,
  );

  const flexWidth = `${props.maxWidth / 2}vw - ${props.widths.dropdownWidth /
    2}px - ${props.widths.margins / 2}px -  ${props.widths.iconWidth / 2}px`;
  /* eslint-disable */
  console.log("rrai", props.maxWidth, flexWidth);
  return (
    <ConditionBox key={index}>
      {/* Component to input the LHS for single condition */}
      <FormControl
        config={{
          ...keyFieldConfig,
          customStyles: {
            width: `calc(${flexWidth})`,
            margin: `${
              props.currentNumberOfFields > 1 ? "0 8px" : "0px 8px 0px 0px"
            }`,
          },
          configProperty: keyPath,
        }}
        formName={props.formName}
      />
      {/* Component to select the operator for the 2 inputs */}
      <FormControl
        config={{
          ...conditionFieldConfig,
          customStyles: { width: `${DropdownWidth}px`, margin: "0 8px" },
          configProperty: conditionPath,
          options: props.comparisonTypes,
          initialValue: props.comparisonTypes[0].value,
        }}
        formName={props.formName}
      />
      {/* Component to input the RHS for single component */}
      <FormControl
        config={{
          ...valueFieldConfig,
          customStyles: {
            width: `calc(${flexWidth})`,
            margin: "0 8px",
          },
          configProperty: valuePath,
        }}
        formName={props.formName}
      />
      {/* Component to render the delete icon */}
      {index ? (
        <CenteredIcon
          name="cross"
          onClick={(e) => {
            e.stopPropagation();
            props.onDeletePressed(index);
          }}
          size={IconSize.SMALL}
        />
      ) : null}
    </ConditionBox>
  );
}

// This is the block which contains an operator and multiple conditions/ condition blocks
function ConditionBlock(props: any) {
  const formValues: any = useSelector((state) =>
    getFormValues(props.formName)(state),
  );

  const onDeletePressed = (index: number) => {
    props.fields.remove(index);
  };

  // sometimes, this condition runs before the appropriate formValues has been initialized with the correct query values.
  useEffect(() => {
    // so make sure the new formValue has been initialized with the where object,
    // especially when switching between various queries across the same Query editor form.
    const whereConfigValue = _.get(formValues, props.configProperty);
    // if the where object exists then it means the initialization of the form has been completed.
    // if the where object exists and the length of children field is less than one, add a new field.
    if (props.fields.length < 1 && !!whereConfigValue) {
      if (props.currentNestingLevel === 0) {
        props.fields.push({
          condition: props.comparisonTypes[0].value,
        });
      } else {
        props.onDeletePressed(props.index);
      }
    }
  }, [props.fields.length]);

  let isDisabled = false;
  if (props.logicalTypes.length === 1) {
    isDisabled = true;
  }
  const conditionPath = getBindingOrConfigPathsForWhereClauseControl(
    props.configProperty,
    WhereClauseSubComponent.Condition,
  );

  let newWidths: { dropdownWidth: number; margins: number; iconWidth: number };
  if (props.fields.length > 1) {
    newWidths = {
      dropdownWidth: props.widths.dropdownWidth + DropdownWidth,
      margins: props.widths.margins + Margin * 6,
      iconWidth:
        props.currentNestingLevel > 1
          ? props.fields.length > 1
            ? props.widths.iconWidth + IconWidth
            : props.widths.iconWidth
          : 0,
    };
  } else {
    newWidths = {
      dropdownWidth: props.widths.dropdownWidth,
      margins: props.widths.margins + Margin * 4,
      iconWidth:
        props.currentNestingLevel > 1
          ? props.fields.length > 1
            ? props.widths.iconWidth + IconWidth
            : props.widths.iconWidth
          : 0,
    };
  }

  return (
    <SecondaryBox showBorder={props.currentNestingLevel >= 1}>
      {/* Component to render the joining operator between multiple conditions */}
      {props.fields.length > 1 ? (
        <div style={{ marginTop: "46px" }}>
          <FormControl
            config={{
              ...logicalFieldConfig,
              customStyles: { width: `${DropdownWidth}px` },
              configProperty: conditionPath,
              options: props.logicalTypes,
              initialValue: props.logicalTypes[0].value,
              isDisabled,
            }}
            formName={props.formName}
          />
        </div>
      ) : null}
      <ConditionWrapper>
        {props.fields &&
          props.fields.length > 0 &&
          props.fields.map((field: any, index: number) => {
            const fieldValue: whereClauseValueType = props.fields.get(index);
            if (!!fieldValue && "children" in fieldValue) {
              // If the value contains children in it, that means it is a ConditionBlock
              return (
                <ConditionBox>
                  <FieldArray
                    component={ConditionBlock}
                    key={`${field}.children`}
                    name={`${field}.children`}
                    props={{
                      maxWidth: props.maxWidth,
                      widths: {
                        dropdownWidth: newWidths.dropdownWidth,
                        margins: newWidths.margins,
                        iconWidth: newWidths.iconWidth,
                      },
                      configProperty: `${field}`,
                      formName: props.formName,
                      logicalTypes: props.logicalTypes,
                      comparisonTypes: props.comparisonTypes,
                      nestedLevels: props.nestedLevels,
                      currentNestingLevel: props.currentNestingLevel + 1,
                      onDeletePressed,
                      index,
                    }}
                    rerenderOnEveryChange={false}
                  />
                  <CenteredIcon
                    alignSelf={"start"}
                    marginBottom={"-5px"}
                    name="cross"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePressed(index);
                    }}
                    size={IconSize.SMALL}
                  />
                </ConditionBox>
              );
            } else {
              // Render a single condition component
              return ConditionComponent(
                {
                  onDeletePressed,
                  field,
                  formName: props.formName,
                  comparisonTypes: props.comparisonTypes,
                  maxWidth: props.maxWidth,
                  widths: newWidths,
                  currentNumberOfFields: props.fields.length,
                },
                index,
              );
            }
          })}
      </ConditionWrapper>

      <ActionBox
        marginLeft={`${props.fields.length > 1 ? DropdownWidth + Margin : 0}px`}
      >
        <AddMoreAction
          onClick={() =>
            props.fields.push({ condition: props.comparisonTypes[0].value })
          }
        >
          <Icon name="add-more-fill" size={IconSize.XL} />
          <span>Add Where Condition</span>
        </AddMoreAction>
        {/* Check if the config allows more nesting, if it does, allow for adding more blocks */}
        {props.currentNestingLevel < props.nestedLevels && (
          <AddMoreAction
            onClick={() => {
              props.fields.push({
                condition: props.logicalTypes[0].value,
                children: [
                  {
                    condition: props.comparisonTypes[0].value,
                  },
                ],
              });
            }}
          >
            <Icon name="add-more-fill" size={IconSize.XL} />
            <span>Add Where Group Condition</span>
          </AddMoreAction>
        )}
      </ActionBox>
    </SecondaryBox>
  );
}

export default function WhereClauseControl(props: WhereClauseControlProps) {
  const {
    comparisonTypes, // All possible keys for the comparison
    configProperty, // JSON path for the where clause data
    formName, // Name of the form, used by redux-form lib to store the data in redux store
    logicalTypes, // All possible keys for the logical operators joining multiple conditions
    nestedLevels, // Number of nested levels allowed
  } = props;

  // Max width is designed in a way that the proportion stays same even after nesting
  const maxWidth = 55; //in vw
  return (
    <FieldArray
      component={ConditionBlock}
      key={`${configProperty}.children`}
      name={`${configProperty}.children`}
      props={{
        configProperty,
        maxWidth,
        widths: {
          //widths currently beign consumed by dropdown, Cross Icon and margins
          dropdownWidth: 0, //in pixels
          margins: 0, //in pixels
          iconWidth: 0, //in pixels
        },
        formName,
        logicalTypes,
        comparisonTypes,
        nestedLevels,
        currentNestingLevel: 0,
      }}
      rerenderOnEveryChange={false}
    />
  );
}

export type WhereClauseControlProps = ControlProps;
