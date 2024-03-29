import React, { useEffect, useRef, useState } from 'react';

import {
  useTranslation,
  scopeKeys,
  useSnackbar,
} from 'component/base';

import {
  BasePage,
  Card,
  Input,
  withFormPage,
  InformationText,
  Select
} from 'component/ui';

/**
 * UI unique identifier meta-data.
 * generate-uiKey komutu ile uikey oluşturuldu ve Route'a tanımlandı
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u747cnga007',
};

// Update sayfası ile yetkili kişi başvuruyu değerlendirip bir karar oluşturabilir
// Başvuru adına kullanıcıya bir mesaj gösterebilir ve başvuru durumu güncelleyebilir.
const SampleUpdate = ({ close, isBpm, Id, ...rest }) => {
  const { translate } = useTranslation();
  const { enqueueError } = useSnackbar();

  const [ dataSource, setDataSource ] = useState();

  const messageRef = useRef();
  const statusRef = useRef();

  const getDataSource = (Id) => {
    fetch(`http://investmentbank.localhost:60000/api/dummydata/${Id}`)
      .then((response) => response.json())
      .then((data) => {
        setDataSource(data);
      })
      .catch((error) => {
        console.error('-api/dummydata/:id- error: ', error);
      });
  };

  useEffect(() => {
    Id && getDataSource(Id);
  }, [Id]);

  const onActionClick = (action) => {
    if (action.commandName === 'Save') {
      // 
      const data = {
        Id: dataSource.Id,
        Message: messageRef.current.value,
        Status: ["inceleniyor", "reddedildi", "onaylandı"].includes(statusRef.current.value)
        ? statusRef.current.value
        : "inceleniyor"
      }
      fetch(`http://investmentbank.localhost:60000/api/dummydata/${data.Id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Veriyi JSON formatına çevirip gönderme
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(updatedData => {
          console.log('Güncellenmiş Veri:', updatedData);
          close(updatedData);
        })
        .catch(error => {
          console.error('Veri güncelleme hatası:', error);
          enqueueError('Veri güncelleme hatası:')
        });
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
        { name: 'Save', scopeKey: scopeKeys.Public },
      ]}
    >
      <Card scopeKey={scopeKeys.Public}>
        <InformationText
          subtitle={dataSource?.Name}
          title={translate('Name')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Surname}
          title={translate('Surname')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Age}
          title={translate('Age')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Email}
          title={translate('Email')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Address}
          title={translate('Address')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.TicketDescription}
          title={translate('Ticket description')}
          xs={4}
        />
        <Input
          ref={messageRef}
          rows={3}
          xs={12}
          multiline
          label={translate('Send a message to the user for ticket')}
          value={dataSource?.Message}
        />
        <Select
          xs={12}
          name="Status"
          label={translate("Update user's ticket status")}
          datasource={[
            { Status: 'inceleniyor' },
            { Status: 'onaylandı' },
            { Status: 'reddedildi' },
          ]}
          ref={statusRef}
          valuePath={'Status'}
          value={dataSource?.Status}
        />
      </Card>
    </BasePage>
  );
};

export default withFormPage(SampleUpdate, { uiMetadata });
