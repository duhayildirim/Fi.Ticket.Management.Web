import React, { useEffect, useRef, useState, useMemo } from 'react';

import {
  useAuthenticationContext,
  useFiProxy,
  useSnackbar,
  useTranslation,
  useTransactionContext,
  scopeKeys,
  stringFormat
} from 'component/base';
import {
  BasePage,
  Card,
  Checkbox,
  Input,
  Select,
  SelectEnum,
  DatePicker,
  withFormPage,
} from 'component/ui';

import { apiUrls } from '../../constants';

/**
 * UI unique identifier meta-data.
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u7e7c13a017',
};

const SampleDefinition = ({ close, isBpm, Id, ...rest }) => {
  const { translate } = useTranslation();
  const { tenant, user } = useAuthenticationContext();
  const { enqueueSnackbar } = useSnackbar();

  const [dataModel, setDataModel] = useState({});

  const nameRef = useRef();
  const codeRef = useRef();
  const descriptionRef = useRef();
  const isActiveRef = useRef(false);

  const { executeGet, executePost, executePut } = useFiProxy();

  useEffect(() => {
    Id && getSampleData(Id);
  }, []);

  const filledState = (dataContract) => {
    if (dataContract) {
      setDataModel(dataContract);
    }
  };

  const getSampleData = (Id) => {
    // executeGet({
    //   url: stringFormat(apiUrls.TestDefinitionsByIdApi, Id),
    //   baseURL: 'http://localhost:10047/'
    // }).then((response) => {
    //   if (response.Success) {
    //     filledState(response.Value);
    //   }
    // });

    executeGet({ url: stringFormat(apiUrls.MetaDataCountriesById, Id) }).then((response) => {
      if (response.Value) {
        setDataModel(response.Value);
      }
    });
  };

  const onValueChanged = (field, value) => {
    setDataModel({ ...dataModel, [field]: value });
  };

  const onActionClick = (action) => {
    if (action.commandName === 'Save') {
      if (Id > 0) {
        executePut({
          url: apiUrls.Api + Id,
          data: {
            ...dataModel,
            Name: nameRef.current.value,
            Code: codeRef.current.value,
            Description: descriptionRef.current.value,
            IsActive:
              isActiveRef.current && isActiveRef.current.value ? true : false,
            BeginDate: dataModel.BeginDate,
            EndDate: dataModel.EndDate,
          },
        }).then((response) => {
          if (response.Success) {
            close();
          }
        });
      } else {
        const data = {
          ...dataModel,
          Name: nameRef.current.value,
          Code: codeRef.current.value,
          Description: descriptionRef.current.value,
          IsActive: isActiveRef.current.value ? true : false,
          BeginDate: dataModel.BeginDate,
          EndDate: dataModel.EndDate,
        };
        close(data);
        // executePost({
        //   url: apiUrls.TestDefinitionsApi,
        //   baseURL: 'http://localhost:10047/',
        //   data: {
        //     ...dataModel,
        //     Name: nameRef.current.value,
        //     Code: codeRef.current.value,
        //     Description: descriptionRef.current.value,
        //     IsActive: isActiveRef.current.value ? true : false,
        //     BeginDate: dataModel.BeginDate,
        //     EndDate: dataModel.EndDate,
        //   },
        // }).then((response) => {
        //   if (response.Success) {
        //     close(true);
        //   }
        // });
      }
    } else if (action.commandName == 'Cancel') {
      close && close(false);
    }
  };

  return (
    <BasePage
      {...rest}
      onActionClick={onActionClick}
      actionList={[
        { name: 'Cancel' },
        { name: 'Save', scopeKey: scopeKeys.Create_Loan },
      ]}
    >
      <Card scopeKey={scopeKeys.Create_Loan}>
        <Input
          xs={6}
          required
          ref={nameRef}
          label={translate('Name')}
          value={dataModel.Name}
        />
        <Input
          xs={6}
          required
          ref={codeRef}
          label={translate('Code')}
          value={dataModel.Name}
        />
        <SelectEnum
          xs={6}
          name="Category"
          label={translate('Category')}
          enumName={'CategoryType'}
          columns={['Name']}
          valuePath={'Code'}
          value={dataModel.Category}
        />
        <Select
          xs={6}
          name="City"
          label={translate('City')}
          datasource={[
            { name: 'City 1', code: 1 },
            { name: 'City 2', code: 2 },
            { name: 'City 3', code: 3 },
          ]}
          onChange={(value) => onValueChanged('City', value)}
          columns={['name']}
          valuePath={'code'}
          value={dataModel.Category}
        />
        <DatePicker
          xs={6}
          name="BeginDate"
          label={translate('Begin date')}
          value={dataModel.BeginDate}
          onChange={(value) => onValueChanged('BeginDate', value)}
          views={['year', 'month', 'day']}
        />
        <DatePicker
          xs={6}
          name="EndDate"
          label={translate('End date')}
          value={dataModel.EndDate}
          onChange={(value) => onValueChanged('EndDate', value)}
          views={['year', 'month', 'day']}
        />
        <Checkbox xs={6} ref={isActiveRef} label={translate('Is active')} />
        <Input
          xs={12}
          required
          ref={descriptionRef}
          rows={3}
          multiline
          label={translate('Description')}
        />
      </Card>
    </BasePage>
  );
};

export default withFormPage(SampleDefinition, { uiMetadata });
