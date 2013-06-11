<?php

class ApiController extends Zend_Controller_Action
{

    public function init()
    {
        $this->_helper->layout->setLayout('api');
    }

    public function indexAction()
    {
        // action body
    }


}

