import React, { useEffect, useMemo, useState, useCallback } from 'react';

import {
  useAuthenticationContext,
  useFiProxy,
  useFormManagerContext,
  useSnackbar,
  useTranslation,
  scopeKeys,
  stringFormat,
} from 'component/base';
import { Card, DataGrid, Filter, Input, Select, BasePage, withFormPage } from 'component/ui';

import SampleDefinition from '../sample-definition';
import { apiUrls } from '../../constants';

/**
 * UI unique identifier meta-data.
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u24bddfade6',
};

const SampleList = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { tenant } = useAuthenticationContext();
  const { showDialog } = useFormManagerContext();
  const [dataSource, setDataSource] = useState([]);
  const { translate } = useTranslation();

  const { executeGet, executeDelete } = useFiProxy();

  useEffect(() => {
    getDataSource();
  }, []);

  const getDataSource = (data) => {
    
    if(data?.Id){
      fetch(`http://investmentbank.localhost:60000/api/dummydata/${data.Id}`)
        .then((response) => response.json())
        .then((data) => {
            setDataSource([data]);
        })
        .catch((error) => {
            console.error('-api/dummydata/:id- error: ', error);
        });
    } else {
      fetch('http://investmentbank.localhost:60000/api/dummydata')
        .then((response) => response.json())
        .then((data) => {
          setDataSource(data);
        })
        .catch((error) => {
          console.error('-api/dummydata- error: ', error);
        });
    }
  };

  const columns = useMemo(() => {
    return [
      { name: 'Id', header: translate('Id'), visible: false },
      { name: 'Name', header: translate('Name') },
      { name: 'Surname', header: translate('Surname') },
      { name: 'Age', header: translate('Age') },
      { name: 'Email', header: translate('Email') },
      { name: 'TicketDescription', header: translate('Ticket description'), defaultFlex: 1 },
      { name: 'Status', header: translate('Ticket status'), backgroundColor : "red"},
      { name: 'Address', header: translate('Address')}
    ];
  }, []);

  const onActionClick = (action) => {};

  const addClicked = useCallback(() => {
    return true;
  }, []);

  const viewClicked = useCallback(() => {
    return true
  }, []);
  
  const editClicked = useCallback(() => {
    return true;
  }, []);

  const deleteClicked = useCallback(() => {
    return true;
  }, []);

  const gridActionList = useMemo(
    () => [
      {
        name: 'delete',
        onClick: deleteClicked,
        scopeKey: scopeKeys.Public,
      },
      {
        name: 'edit',
        onClick: editClicked,
        scopeKey: scopeKeys.Public,
      },
      {
        name: 'detail',
        onClick: viewClicked,
        scopeKey: scopeKeys.Public,
      }
    ],
    [deleteClicked, editClicked, viewClicked]
  );

  const cardActionList = useMemo(
    () => [
      {
        name: 'Add',
        icon: 'add',
        onClick: addClicked,
        scopeKey: scopeKeys.Public,
      }
    ]
  )

  return (
    <BasePage {...props} title="Başvuru yönetimi" onActionClick={onActionClick} >
      <Filter onFilter={(data) => getDataSource(data)}>
        <Input
          name={'Id'}
          label={translate('Id')}
          primaryFilter
          xs={2}
        />
      </Filter>
      <Card
        showHeader={true}
        actionList={cardActionList}
        scopeKey={scopeKeys.Public}
      >
        <DataGrid
          dataSource={dataSource}
          columns={columns}
          actionList={gridActionList}
          autoSizeAllColumns
        />
      </Card>  
    </BasePage>
  );
};
SampleList.displayName = 'SampleList';

export default withFormPage(SampleList, { uiMetadata });
