<?php

App::uses('Estatistica', 'Model');


class ImportStatisticsJsonShell extends AppShell
{

    /**
     * Model de Estatistica
     * @var Cake.Model
     */
    private $Estatistica;

   

    /**
     * Datasource Model
     * @var Cake.Datasource
     */
    private $dataSource;

    /**
     * Função principal do módulo, instancimento de modelos e
     * configurações de cache
     */
    public function main()
    {
        $this->Estatistica = new Estatistica();

        $this->dataSource = $this->Estatistica->getDataSource();

        $fileJson  = new File($this->args[0]);
        $json      = utf8_decode($fileJson->read());
        $jsonDados = json_decode($json, true);


        $this->import($jsonDados);

    }


    private function import($data){        

        foreach ($data as $key => $value) {
            
            $this->Estatistica->create();

            $stats = array(
                'Estatistica' => array(
                    'territorio' => $value['territorio'],
                    'classe' => $value['classe'],
                    'ano' => $value['ano'],
                    'area' => $value['area'],
                    'percentagem' => $value['percentagem'],
                )
            );

            $this->Estatistica->save($stats);           

            echo $value['territorio'] . ' - ' .
                $value['ano'] . ' - ' .
                $value['classe'] . ' - ' .
                $value['area']."\n";
        }
    }    

    private function runSql($sql)
    {

        $dbHost     = $this->dataSource->config['host'];
        $dbName     = $this->dataSource->config['database'];
        $dbLogin    = $this->dataSource->config['login'];
        $dbPassword = $this->dataSource->config['password'];

        $result = null;

        try {
            $db = new PDO("pgsql:host=$dbHost;dbname=$dbName", $dbLogin, $dbPassword);
            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, 1);
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll();
        } catch (Exception $e) {
            echo $e;
        }

        return $result;
    }

}
