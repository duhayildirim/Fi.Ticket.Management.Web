import React, { useEffect, useMemo, useState, useCallback } from 'react';

import {
  useFormManagerContext,
  useTranslation,
  scopeKeys,
} from 'component/base';
import { Card, DataGrid, Filter, Input, InputFormat, BasePage, withFormPage, Select } from 'component/ui';

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

  //  Kart üzerindeki filtreleme için dataların kontrol edildiği fonksiyon
  const prepareData = (data) => {
    const preparedData = { ...data };
  
    if (data?.id === "" || data?.id === undefined || data?.id === null) {
      preparedData.id = undefined;
    }
  
    if (data?.message === "" || data?.message === undefined || data?.message === null) {
      preparedData.message = undefined;
    }
  
    if (data?.status === "" || data?.status === undefined || data?.status === null 
      || !["inceleniyor", "onaylandı", "reddedildi"].includes(data?.status)) {
      preparedData.status = undefined;
    }
  
    return preparedData;
  };
  
  // Parametre gelirse search olarak çalışır aksi taktirde tüm veriyi listeler
  const getDataSource = (data) => {
    if (data?.Id || data?.Message || data?.Status) {
      const preparedData = prepareData(data);
      fetch('http://investmentbank.localhost:60000/api/dummydata/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData),
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Arama hatası:', response.statusText);
        }
      })
      .then(result => {
        console.log('Arama sonuçları:', result);
        setDataSource(result);
      })
      .catch(error => {
        console.error('Arama hatası:', error);
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

  // Yeni başvuru ekleme diyalogunu açar
  const addClicked = useCallback(() => {
    showDialog({
      title: translate('Create ticket'),
      content: <SampleDefinition />,
      callback: (data) => {
        // ekleme işlemi başırılıysa yeni eklenen data apiden döner callback ile liste render edilir
        if(data){
          getDataSource();
        }
      },
    });
  }, []);

  // Tüm başvuru detayını gösteren diyalogu açar
  const viewClicked = useCallback((id, data) => {
    showDialog({
      title: translate('Ticket details'),
      content: <SampleDetail Id={data.Id} />,
      // detay sayfası data üzerinde herhangi bir işlem yapmadığından callback yapmasına ve
      // listeyi baştan render etmesine gerek yoktur.
    });
  }, []);
  
  // Başvuru güncelleme diyalogunu açar
  const editClicked = useCallback((id, data) => {
    showDialog({
      title: translate('Update ticket'),
      content: <SampleUpdate Id={data.Id} />,
      callback: (data) => {
        // güncelleme işlemi başırılıysa güncellenen data apiden döner callback ile liste render edilir
        if(data){
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
          // silme işlemi başarılıysa silinen data apiden döner callback ile liste render edilir
          if (data) {
            getDataSource();
          }
        })
        .catch((error) => {
          console.error('Veri silme hatası:', error);
        });
    }
  };

  // Data grid aksiyonları
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

  // Kart aksiyonları
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
        <InputFormat
          name={'Id'}
          mask={/^[1-9]?[0-9]{1}$|^100$/}
          placeholder="only number"
          label={translate('Filter by ticket no')}
          primaryFilter
          xs={2}
        />
        <Input
          name={'Message'}
          xs={4}
          multiline
          label={translate('Filter by message sent to the user')}
          primaryFilter
        />
        <Select
          xs={3}
          name={"Status"}
          label={translate("Filter by application status")}
          datasource={[
            { Status: 'inceleniyor' },
            { Status: 'onaylandı' },
            { Status: 'reddedildi' },
          ]}
          valuePath={'Status'}
          primaryFilter
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
          idProperty="Id"
        />
      </Card>  
    </BasePage>
  );
};
SampleList.displayName = 'SampleList';

export default withFormPage(SampleList, { uiMetadata });
