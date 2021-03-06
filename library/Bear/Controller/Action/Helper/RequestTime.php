<?php
/**
 * Bear
 *
 * @author Justin Hendrickson <justin.hendrickson@sierra-bravo.com>
 * @category Bear
 * @package Bear_Controller
 * @since 1.1.0
 */

/** Zend_Controller_Action_Helper_Abstract */
require_once "Zend/Controller/Action/Helper/Abstract.php";

require_once "Zend/Date.php";

/**
 * Request time action helper
 *
 * @category Bear
 * @package Bear_Controller
 */
class Bear_Controller_Action_Helper_RequestTime extends Zend_Controller_Action_Helper_Abstract
{
    /**
     * @var Zend_Date
     */
    protected $_requestTime;

    /**
     * Get the request time
     *
     * @return Zend_Date
     * @see getRequestTime()
     */
    public function direct()
    {
        return $this->getRequestTime();
    }

    /**
     * Get the request time
     *
     * @return Zend_Date
     */
    public function getRequestTime()
    {
        if (! $this->_requestTime) {
            $this->_requestTime = new Zend_Date(
                $this->getRequest()
                     ->REQUEST_TIME
            );
        }

        return $this->_requestTime;
    }

    /**
     * Set the request time
     * 
     * @param Zend_Date $requestTime
     * @return Bear_Controller_Action_Helper_RequestTime
     */
    public function setRequestTime(Zend_Date $requestTime)
    {
        $this->_requestTime = $requestTime;
        return $this;
    }

}