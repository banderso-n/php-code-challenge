<?php
class Response
{

    public $success = true;

    public function __construct() {

    }

    public function __toString() {
        $responseArray = array();
        foreach ($this as $key => $val) {
            $responseArray[$key] = $val;
        }
        return json_encode($responseArray);
    }

    public function setError($errorMessage) {
        $this->success = false;
        $this->errorMessage = $errorMessage;
        return $this;
    }

    public function setData($data) {
        $this->data = $data;
    }

}
?>