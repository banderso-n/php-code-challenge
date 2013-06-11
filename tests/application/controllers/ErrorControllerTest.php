<?php

class ErrorControllerTest extends Bear_Test_PHPUnit_ControllerTestCase
{
    protected function setUp()
    {
        parent::setUp();
    }

    public function testPageNotFoundController()
    {
        $this->dispatch('/invalid-controller');
        $this->assertController('error');
        $this->assertAction('not-found');
        $this->assertResponseCode(404);
    }

    public function testPageNotFoundAction()
    {
        $this->dispatch('/error-test/invalid-action');
        $this->assertController('error');
        $this->assertAction('not-found');
        $this->assertResponseCode(404);
    }

    public function testParameterMissingAction()
    {
        $this->dispatch('/error-test/force-parameter-missing');
        $this->assertController('error');
        $this->assertAction('not-found');
        $this->assertResponseCode(404);
    }

    public function testResourceNotFoundAction()
    {
        $this->dispatch('/error-test/force-resource-not-found');
        $this->assertController('error');
        $this->assertAction('not-found');
        $this->assertResponseCode(404);
    }

    public function testInternalServerError()
    {
        $this->dispatch('/error-tester/force-error');
        $this->assertController('error');
        $this->assertAction('internal-server-error');
        $this->assertResponseCode(500);
    }

    public function testForbidden()
    {
        $this->dispatch('/error-tester/force-forbidden');
        $this->assertController('error');
        $this->assertAction('forbidden');
        $this->assertResponseCode(403);
    }

    public function testAuthenticationRequired()
    {
        $this->dispatch('/error-tester/force-authentication-required');
        $this->assertController('error');
        $this->assertAction('authentication-required');
        $this->assertRedirectTo('/users/account/login');
    }

    public function testAuthenticationRequiredJsonContext()
    {
        $this->request->setHeader('X_REQUESTED_WITH', 'XMLHttpRequest');

        $this->dispatch('/error-tester/force-authentication-required/format/json');
        $this->assertController('error');
        $this->assertAction('authentication-required');

        $rawOutput = $this->response->outputBody();
        $jsonOutput = Zend_Json::decode($rawOutput);

        $this->assertEquals(
            array(
                'success' => false,
                'status'  => 'error',
                'message' => 'Your session has expired. Please login to continue.',
            ),
            $jsonOutput
        );
    }

    public function testAuthenticationRequiredAjaxContext()
    {
        $this->request->setHeader('X_REQUESTED_WITH', 'XMLHttpRequest');

        $this->dispatch('/error-tester/force-authentication-required/format/html');
        $this->assertController('error');
        $this->assertAction('authentication-required');

        $this->assertNotQuery('head');
        $this->assertQuery('a[href="/users/account/login"]');
    }

    public function testLogger()
    {
        /** @var $log Zend_Log */
        $log = $this->bootstrap->getBootstrap()->getResource('log');

        $mockLogWriter = new Zend_Log_Writer_Mock();
        $log->addWriter($mockLogWriter);

        $this->dispatch('/invalid-controller');

        $this->assertEquals(
            "Page Not Found: /invalid-controller - Invalid controller specified (invalid-controller)",
            $mockLogWriter->events[0]['message']
        );
    }

    public function testDisplayExceptions()
    {
        $this->dispatch('/invalid-controller');

        $this->assertQueryContentContains('h2', 'Invalid controller specified');
    }

    public function testNoDisplayExceptions()
    {
        // disable displaying exceptions via config
        $options = $this->bootstrap->getOptions();
        $options['resources']['frontController']['params']['displayExceptions'] = 0;
        $this->bootstrap->setOptions($options);

        $this->bootstrap();

        $this->dispatch('/invalid-controller');

        $this->assertNotQueryContentContains('h2', 'Invalid controller specified');
    }

}

class ErrorTesterController extends Zend_Controller_Action
{

    public function init()
    {
        /**
         * Setup contexts
         */
        $contextSwitch = $this->_helper->ajaxContext;
        $contextSwitch->addActionContext('force-authentication-required', array('html', 'json'))
                      ->initContext();
    }

    public function forceErrorAction()
    {
        throw new Exception('Test exception');
    }

    public function forceForbiddenAction()
    {
        throw new Bear_Controller_Action_Exception_NotAuthorized('You are not authorized');
    }

    public function forceAuthenticationRequiredAction()
    {
        throw new Bear_Controller_Action_Exception_NotAuthenticated('You need to log in');
    }

    public function forceParameterMissingAction()
    {
        throw new Bear_Controller_Action_Exception_ParameterMissing('Missing parameter');
    }

    public function forceResourceNotFoundAction()
    {
        throw new Bear_Controller_Action_Exception_ResourceNotFound('Missing resource');
    }
}