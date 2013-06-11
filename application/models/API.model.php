<?php
abstract class API
{
    const NERDERY_API_KEY = 'eb6020e01519818f9672d59ba6674ad8';
    const GIANT_BOMB_API_KEY = '7b3ce94f83e0847d0a72034cdd172400e57a9f6a';

    /**
     * Cache the soap client connection
     * @var SoapClient
     */
    private $_soapClient;

    //////////////////////////////////////////////////
    // SOAP SERVER CALLS
    //////////////////////////////////////////////////

    /**
     * Invoke the checkKey method on the soap server api
     * @return Boolean  TRUE on success, FALSE on failure
     */
    static function checkKey() {
        $soapClient = self::connectToSoapServer();
        return $isValid = $soapClient->checkKey(self::NERDERY_API_KEY);
    }

    /**
     * Invoke the getGames method on the soap server api
     * @return Array    Array of game objects
     */
    static function getGames() {
        $soapClient = self::connectToSoapServer();
        return $games = $soapClient->getGames(self::NERDERY_API_KEY);
    }

    /**
     * Invoke the checkKey method on the soap server api
     * @param  Int      $gameId     Unique ID of game to increment vote count
     * @return Boolean  TRUE on success, FALSE on failure
     */
    static function addVote($gameId) {
        $soapClient = self::connectToSoapServer();
        return $success = $soapClient->addVote(self::NERDERY_API_KEY, $gameId);
    }

    /**
     * Invoke the addGame method on the soap server api
     * @param  string   $gameTitle  New game title
     * @return Boolean  TRUE on success, FALSE on failure
     */
    static function addGame($gameTitle) {
        $soapClient = self::connectToSoapServer();
        return $success = $soapClient->addGame(self::NERDERY_API_KEY, $gameTitle);
    }

    /**
     * Invoke the setGotIt method on the soap server api
     * @param  Int      $gameId     Unique ID of game to set status to 'gotit'
     * @return Boolean  TRUE on success, FALSE on failure
     */
    static function setGotIt($gameId) {
        $soapClient = self::connectToSoapServer();
        return $success = $soapClient->setGotIt(self::NERDERY_API_KEY, $gameId);
    }

    /**
     * Invoke the clearGames method on the soap server api
     * @return Boolean  TRUE on success, FALSE on failure
     */
    static function clearGames() {
        $soapClient = self::connectToSoapServer();
        return $success = $soapClient->clearGames(self::NERDERY_API_KEY);
    }

    /**
     * Connect to the Nerdery Soap server
     * @return SoapClient
     */
    static function connectToSoapServer() {
        if ($_soapClient instanceof SoapClient) {
            return $_soapClient;
        }
        $soapOptions = array('location' => 'http://xbox.sierrabravo.net/v2/xbox.php');
        return new SoapClient('http://xbox.sierrabravo.net/v2/xbox.wsdl', $soapOptions);
    }


    //////////////////////////////////////////////////
    // GIANT BOMB API CALLS
    //////////////////////////////////////////////////

    /**
     * Formulate and execute an api call to Giant Bomb
     * @see http://api.giantbomb.com/documentation/
     * @param Array    $customParams
     * @return JSON    Results of api call
     */
    static function giantBombApiCall($customParams) {
        $baseUrl = 'http://api.giantbomb.com/';
        $module = 'search';
        $params = array(
            'api_key' => self::GIANT_BOMB_API_KEY,
            'format' => 'json',
            'resources' => 'game'
        );
        $params = array_merge($params, $customParams);
        $queryString = http_build_query($params);
        $call = $baseUrl . $module . '?' . $queryString;
        return json_decode(file_get_contents($call));
    }

    /**
     * Perform a search using Giant Bomb's API
     * @param String    $gameTitle
     */
    static function search($gameTitle) {
        $customParams = array('query' => $gameTitle, 'limit' => 3);
        return self::giantBombApiCall($customParams);
    }
}
?>