import React, { useEffect, useState } from 'react';

import {
  scopeKeys,
  useTranslation
} from 'component/base';
import {
  BasePage,
  Card,
  InformationText,
  withFormPage
} from 'component/ui';

/**
 * UI unique identifier meta-data. 
 * generate-uiKey komutu ile uikey oluşturuldu ve Route'a tanımlandı
 */
const uiMetadata = {
  moduleName: 'playground',
  uiKey: 'u29dhazade8',
};

// Data grid ekranında tüm verilerin listelenmesine gerek olmadığından 
// ayrı bir detay sayfasıyla, ilgili datanın tüm detaylarını gösterecek bir diyalog oluşturuldu
// Datagrid Row Detail yapısı yerine daha fazla kodlama ve frameworkü anlamak açısından detaylar ayrı bir sayfa da tasarlandı.
const SampleDetail = ({close , Id, ...rest}) => {
  const { translate } = useTranslation();

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

  const onActionClick = (action) => {
    if (action.commandName == 'Cancel') {
      close && close(false);
    }
  }

  return (
    <BasePage
      {...rest}
      onActionClick={onActionClick}
      actionList={[
        { name: 'Cancel' },
      ]}
    >
      <Card scopeKey={scopeKeys.Public}>
        <InformationText
          subtitle={dataSource?.Id}
          title={translate('Id')}
          xs={4}
        />
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
          subtitle={dataSource?.Address}
          title={translate('Address')}
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
        <InformationText
          subtitle={dataSource?.Message}
          title={translate('Message sent to user')}
          xs={4}
        />
        <InformationText
          subtitle={dataSource?.Status}
          title={translate('Ticket status')}
          xs={4}
        />
      </Card>
    </BasePage>
  );
};

export default withFormPage(SampleDetail, { uiMetadata });
