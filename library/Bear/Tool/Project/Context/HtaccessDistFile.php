<?php
/**
 * BEAR
 *
 * @category Bear
 * @package Bear_Tool
 */

/**
 * .htaccess-dist File Context
 *
 * @category Bear
 * @package Bear_Tool
 * @author Konr Ness <konr.ness@sierra-bravo.com>
 * @version $Id$
 */
class Bear_Tool_Project_Context_HtaccessDistFile extends Zend_Tool_Project_Context_Zf_HtaccessFile
{

    /**
     * @var string
     */
    protected $_filesystemName = '.htaccess-dist';

    /**
     * getName()
     *
     * @return string
     */
    public function getName()
    {
        return 'HtaccessDistFile';
    }
    
    /**
     * getContents()
     *
     * @return string
     */
    public function getContents()
    {
        $output = <<<EOS
SetEnv APPLICATION_ENV production

# RewriteBase /

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -l
RewriteRule ^.*$ - [NC,L]
RewriteRule ^.*$ index.php [NC,L]

Options All -Indexes
RedirectMatch 404 /\\.svn(/.*|$)
RedirectMatch 404 /\.htaccess(-dist|$)
RedirectMatch 404 /.*\.(sql|log|dist|bak)$

php_flag magic_quotes_gpc off
php_flag magic_quotes_runtime off
php_flag magic_quotes_sybase off
php_flag register_globals off
php_flag track_errors on

EOS;
        return $output;
    }

}
