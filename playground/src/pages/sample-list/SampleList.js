import React, { useEffect, useMemo, useState, useCallback } from 'react';

import {
  useFormManagerContext,
  useTranslation,
  scopeKeys,
} from 'component/base';
import { Card, DataGrid, Filter, Input, BasePage, withFormPage } from 'component/ui';

import SampleDefinition from '../sample-definition';
import SampleDetail from '../sample-detail';
import SampleUpdate from '../sample-update';

/**
 * UI unique identifier meta-data.
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u24bddfade6',
};

const SampleList = (props) => {
  const { showDialog } = useFormManagerContext();
  const [ dataSource, setDataSource ] = useState([]);
  const { translate } = useTranslation();

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
    showDialog({
      title: translate('Create ticket'),
      content: <SampleDefinition />,
      callback: (data) => {
        if (data) {
          getDataSource();
        }
      },
    });
  }, []);

  const viewClicked = useCallback((id, data) => {
    showDialog({
      title: translate('Ticket details'),
      content: <SampleDetail Id={data.Id} />,
      callback: (data) => {
        if (data) {
          getDataSource();
        }
      },
    });
  }, []);
  
  const editClicked = useCallback((id, data) => {
    showDialog({
      title: translate('Update ticket'),
      content: <SampleUpdate Id={data.Id} />,
      callback: (data) => {
        if (data) {
          getDataSource();
        }
      },
    });
  }, []);

  const deleteClicked = useCallback((id, data) => {
    data && deleteData(data.Id);
  }, []);

  const deleteData = (id) => {
    if (id) {
      fetch(`http://investmentbank.localhost:60000/api/dummydata/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Veri başarıyla silindi:', data);
          if (data) {
            getDataSource();
          }
        })
        .catch((error) => {
          console.error('Veri silme hatası:', error);
        });
    }
  };

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
