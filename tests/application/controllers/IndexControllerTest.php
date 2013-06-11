<?php

class IndexControllerTest extends Zend_Test_PHPUnit_ControllerTestCase
{
    public function setUp()
    {
        $this->application = new Zend_Application(
            APPLICATION_ENV,
            APPLICATION_PATH . '/configs/application.ini'
        );

        $this->bootstrap = array($this, 'appBootstrap');
        parent::setUp();
    }
    
    public function appBootstrap()
    {
        $this->application->bootstrap();
    }
    
    public function testCallingIndexAction()
    {

        $this->dispatch('/');
        $this->assertController('index');
        $this->assertAction('index');

        $this->assertQuery('#nerdery-name');
        $this->assertQueryContentContains('#nerdery-name', 'Nerdery');

    }

}