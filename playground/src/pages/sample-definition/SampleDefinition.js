import React, { useEffect, useRef, useState, useMemo } from 'react';

import {
  useTranslation,
  scopeKeys,
} from 'component/base';
import {
  BasePage,
  Card,
  Input,
  withFormPage,
} from 'component/ui';

/**
 * UI unique identifier meta-data.
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u7e7c13a017',
};

const SampleDefinition = ({ close, isBpm, Id, ...rest }) => {
  const { translate } = useTranslation();
  const nameRef = useRef();
  const surnameRef = useRef();
  const ageRef = useRef();
  const emailRef = useRef();
  const addressRef = useRef();
  const descriptionRef = useRef();

  const onActionClick = (action) => {
    if (action.commandName === 'Save') {
      const data = {
        Name: nameRef.current.value,
        Surname: surnameRef.current.value,
        Age: ageRef.current.value,
        Email: emailRef.current.value,
        TicketDescription: descriptionRef.current.value,
        Address: addressRef.current.value,
        Message: "",
        Status: "inceleniyor"
      }
      fetch('http://investmentbank.localhost:60000/api/dummydata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((newData) => {
          console.log('Yeni veri eklendi:', newData);
          close();
        })
        .catch((error) => {
          console.error('Veri eklenirken hata oluştu:', error);
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
        <Input
          xs={5}
          required
          ref={nameRef}
          label={translate('Name')}
        />
        <Input
          xs={5}
          required
          ref={surnameRef}
          label={translate('Surname')}
        />
        <Input
          xs={2}
          required
          ref={ageRef}
          mask={/^[1-9]?[0-9]{1}$|^100$/}
          label={translate('Age')}
          inputMode="number"
        />
        <Input
          xs={6}
          required
          ref={emailRef}
          label={translate('Email')}
        />
        <Input
          xs={6}
          required
          ref={addressRef}
          label={translate('Address')}
        />
        <Input
          xs={12}
          required
          ref={descriptionRef}
          rows={3}
          multiline
          label={translate('Ticket description')}
        />
      </Card>
    </BasePage>
  );
};

export default withFormPage(SampleDefinition, { uiMetadata });
