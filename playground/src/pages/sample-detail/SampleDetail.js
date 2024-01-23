import React, { useEffect, useRef, useState, useMemo } from 'react';

import {
  scopeKeys,
} from 'component/base';
import {
  BasePage,
  Card,
  InformationText,
  withFormPage,
} from 'component/ui';

/**
 * UI unique identifier meta-data.
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u29dhazade8',
};

const SampleDetail = ({Id, ...rest}) => {
  const [ dataSource, setDataSource ] = useState();

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

  return (
    <BasePage
      {...rest}
      actionList={[
        { name: 'Cancel' },
      ]}
    >
      <Card scopeKey={scopeKeys.Public}>
        <InformationText
          subtitle={dataSource?.Id}
          title="ID:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Name}
          title="Ad:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Surname}
          title="Soyad"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Age}
          title="Yaşı:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Email}
          title="E-mail:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Address}
          title="Adres:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.TicketDescription}
          title="Başvuru sebebi:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Message}
          title="Kullanıcıya gönderilen mesaj:"
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Status}
          title="Başvuru sonucu:"
          xs={4}
        />

      </Card>
    </BasePage>
  );
};

export default withFormPage(SampleDetail, { uiMetadata });
