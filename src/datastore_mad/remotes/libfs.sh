<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<title>OpenNebula - /src/datastore_mad/remotes/libfs.sh - OpenNebula Development pages</title>
<meta name="description" content="Redmine" />
<meta name="keywords" content="issue,bug,tracker" />
<meta name="csrf-param" content="authenticity_token"/>
<meta name="csrf-token" content="QyP4OIPYmjtP06v6N9awF+wVG4PC/Ce8vTtP+RxbSrk="/>
<link rel='shortcut icon' href='/favicon.ico?1300311341' />
<link href="/themes/opennebula/stylesheets/application.css?1326470968" media="all" rel="stylesheet" type="text/css" />

<script src="/javascripts/prototype.js?1317718677" type="text/javascript"></script>
<script src="/javascripts/effects.js?1300311342" type="text/javascript"></script>
<script src="/javascripts/dragdrop.js?1300311342" type="text/javascript"></script>
<script src="/javascripts/controls.js?1300311342" type="text/javascript"></script>
<script src="/javascripts/application.js?1317718677" type="text/javascript"></script>
<script type="text/javascript">
//<![CDATA[
Event.observe(window, 'load', function(){ new WarnLeavingUnsaved('The current page contains unsaved text that will be lost if you leave this page.'); });
//]]>
</script>

<!--[if IE 6]>
    <style type="text/css">
      * html body{ width: expression( document.documentElement.clientWidth < 900 ? '900px' : '100%' ); }
      body {behavior: url(/stylesheets/csshover.htc?1300311342);}
    </style>
<![endif]-->
 <link rel="stylesheet" href="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/jquery.jqplot.min.css" type="text/css" />

<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery-1.4.2.min.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery-ui-1.8rc3.custom.min.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jeditable.mini.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.cookie.js?1317660873" type="text/javascript"></script>
<!--[if IE]><script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/excanvas.js?1317660874" type="text/javascript"></script><![endif]-->
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/jquery.jqplot.js?1317660874" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/plugins/jqplot.highlighter.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/plugins/jqplot.canvasTextRenderer.min.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/jquery/jquery.jqplot/plugins/jqplot.enhancedLegendRenderer.min.js?1317660873" type="text/javascript"></script>

<script src="/plugin_assets/redmine_backlogs/javascripts/common.js?1317660873" type="text/javascript"></script>
<script src="/plugin_assets/redmine_backlogs/javascripts/burndown.js?1317660873" type="text/javascript"></script>


<!-- page specific tags -->

  <script src="/javascripts/repository_navigation.js?1300311342" type="text/javascript"></script>

<link href="/stylesheets/scm.css?1300311342" media="screen" rel="stylesheet" type="text/css" />
</head>
<body class="theme-Opennebula controller-repositories action-entry">
<div id="wrapper">
<div id="wrapper2">
<div id="top-menu">
    <div id="account">
        <ul><li><a href="/login" class="login">Sign in</a></li>
<li><a href="/account/register" class="register">Register</a></li></ul>    </div>
    
    <ul><li><a href="/" class="home">Home</a></li>
<li><a href="/projects" class="projects">Projects</a></li>
<li><a href="http://www.redmine.org/guide" class="help">Help</a></li></ul></div>
      
<div id="header">
    
    <div id="quick-search">
        <form action="/search/index/opennebula" method="get">
        <input name="changesets" type="hidden" value="1" />
        <a href="/search/index/opennebula" accesskey="4">Search</a>:
        <input accesskey="f" class="small" id="q" name="q" size="20" type="text" />
        </form>
        
    </div>
    
    
    <h1>OpenNebula</h1>
    
    
    <div id="main-menu">
        <ul><li><a href="/projects/opennebula" class="overview">Overview</a></li>
<li><a href="/projects/opennebula/activity" class="activity">Activity</a></li>
<li><a href="/projects/opennebula/roadmap" class="roadmap">Roadmap</a></li>
<li><a href="/projects/opennebula/issues" class="issues">Issues</a></li>
<li><a href="/projects/opennebula/wiki" class="wiki">Wiki</a></li>
<li><a href="/projects/opennebula/files" class="files">Files</a></li>
<li><a href="/projects/opennebula/repository" class="repository selected">Repository</a></li></ul>
    </div>
    
</div>

<div class="nosidebar" id="main">
    <div id="sidebar">        
        
        
    </div>
    
    <div id="content">
				
        

<div class="contextual">
  

<a href="/projects/opennebula/repository/statistics" class="icon icon-stats">Statistics</a>

<form action="/projects/opennebula/repository/entry/src/datastore_mad/remotes/libfs.sh?rev=" id="revision_selector" method="get">  <!-- Branches Dropdown -->
      | Branch: 
    <select id="branch" name="branch"><option value=""></option>
<option value="bug-2093">bug-2093</option>
<option value="feature-1163">feature-1163</option>
<option value="feature-1176">feature-1176</option>
<option value="feature-1372">feature-1372</option>
<option value="feature-1613">feature-1613</option>
<option value="feature-1640">feature-1640</option>
<option value="feature-1782">feature-1782</option>
<option value="feature-1825">feature-1825</option>
<option value="feature-1931">feature-1931</option>
<option value="feature-2027">feature-2027</option>
<option value="feature-2054">feature-2054</option>
<option value="feature-2166">feature-2166</option>
<option value="feature-470">feature-470</option>
<option value="feature-652">feature-652</option>
<option value="master">master</option>
<option value="one-1.2">one-1.2</option>
<option value="one-1.4">one-1.4</option>
<option value="one-2.0">one-2.0</option>
<option value="one-2.2">one-2.2</option>
<option value="one-3.0">one-3.0</option>
<option value="one-3.2">one-3.2</option>
<option value="one-3.4">one-3.4</option>
<option value="one-3.6">one-3.6</option>
<option value="one-3.8">one-3.8</option>
<option value="one-4.0">one-4.0</option>
<option value="one-4.2">one-4.2</option>
<option value="qemu">qemu</option>
<option value="request-157">request-157</option></select>
  
      | Tag: 
    <select id="tag" name="tag"><option value=""></option>
<option value="release-1.2">release-1.2</option>
<option value="release-1.2-beta1">release-1.2-beta1</option>
<option value="release-1.2-beta2">release-1.2-beta2</option>
<option value="release-1.2.1">release-1.2.1</option>
<option value="release-1.4">release-1.4</option>
<option value="release-1.4-beta1">release-1.4-beta1</option>
<option value="release-1.4-beta2">release-1.4-beta2</option>
<option value="release-1.4-rc1">release-1.4-rc1</option>
<option value="release-2.0">release-2.0</option>
<option value="release-2.0-beta1">release-2.0-beta1</option>
<option value="release-2.0-beta2">release-2.0-beta2</option>
<option value="release-2.0-rc1">release-2.0-rc1</option>
<option value="release-2.0.1">release-2.0.1</option>
<option value="release-2.2">release-2.2</option>
<option value="release-2.2-beta1">release-2.2-beta1</option>
<option value="release-2.2-rc1">release-2.2-rc1</option>
<option value="release-2.9.80">release-2.9.80</option>
<option value="release-3.0">release-3.0</option>
<option value="release-3.0-beta1">release-3.0-beta1</option>
<option value="release-3.0-beta2">release-3.0-beta2</option>
<option value="release-3.0-rc1">release-3.0-rc1</option>
<option value="release-3.2">release-3.2</option>
<option value="release-3.2-beta1">release-3.2-beta1</option>
<option value="release-3.2-rc1">release-3.2-rc1</option>
<option value="release-3.2-s0">release-3.2-s0</option>
<option value="release-3.2-s1">release-3.2-s1</option>
<option value="release-3.2.1">release-3.2.1</option>
<option value="release-3.4">release-3.4</option>
<option value="release-3.4-beta1">release-3.4-beta1</option>
<option value="release-3.4-s0">release-3.4-s0</option>
<option value="release-3.4.1">release-3.4.1</option>
<option value="release-3.4.2">release-3.4.2</option>
<option value="release-3.4.3">release-3.4.3</option>
<option value="release-3.4.4">release-3.4.4</option>
<option value="release-3.6.0">release-3.6.0</option>
<option value="release-3.6.1">release-3.6.1</option>
<option value="release-3.6.2">release-3.6.2</option>
<option value="release-3.6.3">release-3.6.3</option>
<option value="release-3.8">release-3.8</option>
<option value="release-3.8-beta1">release-3.8-beta1</option>
<option value="release-3.8.1">release-3.8.1</option>
<option value="release-3.8.2">release-3.8.2</option>
<option value="release-3.8.3">release-3.8.3</option>
<option value="release-3.8.3-2">release-3.8.3-2</option>
<option value="release-3.8.4">release-3.8.4</option>
<option value="release-4.0">release-4.0</option>
<option value="release-4.0-beta1">release-4.0-beta1</option>
<option value="release-4.0-rc">release-4.0-rc</option>
<option value="release-4.0-rc2">release-4.0-rc2</option>
<option value="release-4.0.1">release-4.0.1</option>
<option value="release-4.2">release-4.2</option>
<option value="release-4.2-beta1">release-4.2-beta1</option></select>
  
  | Revision: 
  <input id="rev" name="rev" size="8" type="text" value="6f05c3530d4c849ce22dfc87a752b4edf62bcbd4" />
</form>
</div>

<h2><a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/show">root</a>

    / <a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/show/src">src</a>

    / <a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/show/src/datastore_mad">datastore_mad</a>

    / <a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/show/src/datastore_mad/remotes">remotes</a>


    / <a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/changes/src/datastore_mad/remotes/libfs.sh">libfs.sh</a>


@ 6f05c353

</h2>

<p>

<p>
<a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/changes/src/datastore_mad/remotes/libfs.sh">History</a> |

    View |


    <a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/annotate/src/datastore_mad/remotes/libfs.sh">Annotate</a> |

<a href="/projects/opennebula/repository/revisions/6f05c3530d4c849ce22dfc87a752b4edf62bcbd4/raw/src/datastore_mad/remotes/libfs.sh">Download</a>
(5.9 kB)
</p>


</p>

<div class="autoscroll">
<table class="filecontent syntaxhl">
<tbody>


<tr><th class="line-num" id="L1"><a href="#L1">1</a></th><td class="line-code"><pre>#!/bin/bash
</pre></td></tr>


<tr><th class="line-num" id="L2"><a href="#L2">2</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L3"><a href="#L3">3</a></th><td class="line-code"><pre># -------------------------------------------------------------------------- #
</pre></td></tr>


<tr><th class="line-num" id="L4"><a href="#L4">4</a></th><td class="line-code"><pre># Copyright 2002-2012, OpenNebula Project Leads (OpenNebula.org)             #
</pre></td></tr>


<tr><th class="line-num" id="L5"><a href="#L5">5</a></th><td class="line-code"><pre>#                                                                            #
</pre></td></tr>


<tr><th class="line-num" id="L6"><a href="#L6">6</a></th><td class="line-code"><pre># Licensed under the Apache License, Version 2.0 (the &quot;License&quot;); you may    #
</pre></td></tr>


<tr><th class="line-num" id="L7"><a href="#L7">7</a></th><td class="line-code"><pre># not use this file except in compliance with the License. You may obtain    #
</pre></td></tr>


<tr><th class="line-num" id="L8"><a href="#L8">8</a></th><td class="line-code"><pre># a copy of the License at                                                   #
</pre></td></tr>


<tr><th class="line-num" id="L9"><a href="#L9">9</a></th><td class="line-code"><pre>#                                                                            #
</pre></td></tr>


<tr><th class="line-num" id="L10"><a href="#L10">10</a></th><td class="line-code"><pre># http://www.apache.org/licenses/LICENSE-2.0                                 #
</pre></td></tr>


<tr><th class="line-num" id="L11"><a href="#L11">11</a></th><td class="line-code"><pre>#                                                                            #
</pre></td></tr>


<tr><th class="line-num" id="L12"><a href="#L12">12</a></th><td class="line-code"><pre># Unless required by applicable law or agreed to in writing, software        #
</pre></td></tr>


<tr><th class="line-num" id="L13"><a href="#L13">13</a></th><td class="line-code"><pre># distributed under the License is distributed on an &quot;AS IS&quot; BASIS,          #
</pre></td></tr>


<tr><th class="line-num" id="L14"><a href="#L14">14</a></th><td class="line-code"><pre># WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   #
</pre></td></tr>


<tr><th class="line-num" id="L15"><a href="#L15">15</a></th><td class="line-code"><pre># See the License for the specific language governing permissions and        #
</pre></td></tr>


<tr><th class="line-num" id="L16"><a href="#L16">16</a></th><td class="line-code"><pre># limitations under the License.                                             #
</pre></td></tr>


<tr><th class="line-num" id="L17"><a href="#L17">17</a></th><td class="line-code"><pre>#--------------------------------------------------------------------------- #
</pre></td></tr>


<tr><th class="line-num" id="L18"><a href="#L18">18</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L19"><a href="#L19">19</a></th><td class="line-code"><pre>#------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L20"><a href="#L20">20</a></th><td class="line-code"><pre>#  Set up environment variables
</pre></td></tr>


<tr><th class="line-num" id="L21"><a href="#L21">21</a></th><td class="line-code"><pre>#    @param $1 - Datastore base_path
</pre></td></tr>


<tr><th class="line-num" id="L22"><a href="#L22">22</a></th><td class="line-code"><pre>#    @param $2 - Restricted directories
</pre></td></tr>


<tr><th class="line-num" id="L23"><a href="#L23">23</a></th><td class="line-code"><pre>#    @param $3 - Safe dirs
</pre></td></tr>


<tr><th class="line-num" id="L24"><a href="#L24">24</a></th><td class="line-code"><pre>#    @param $4 - Umask for new file creation (default: 0007)
</pre></td></tr>


<tr><th class="line-num" id="L25"><a href="#L25">25</a></th><td class="line-code"><pre>#    @return sets the following environment variables
</pre></td></tr>


<tr><th class="line-num" id="L26"><a href="#L26">26</a></th><td class="line-code"><pre>#      - RESTRICTED_DIRS: Paths that cannot be used to register images
</pre></td></tr>


<tr><th class="line-num" id="L27"><a href="#L27">27</a></th><td class="line-code"><pre>#      - SAFE_DIRS: Paths that are safe to specify image paths
</pre></td></tr>


<tr><th class="line-num" id="L28"><a href="#L28">28</a></th><td class="line-code"><pre>#      - BASE_PATH: Path where the images will be stored
</pre></td></tr>


<tr><th class="line-num" id="L29"><a href="#L29">29</a></th><td class="line-code"><pre>#------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L30"><a href="#L30">30</a></th><td class="line-code"><pre>function set_up_datastore {
</pre></td></tr>


<tr><th class="line-num" id="L31"><a href="#L31">31</a></th><td class="line-code"><pre>	#
</pre></td></tr>


<tr><th class="line-num" id="L32"><a href="#L32">32</a></th><td class="line-code"><pre>	# Load the default configuration for FS datastores
</pre></td></tr>


<tr><th class="line-num" id="L33"><a href="#L33">33</a></th><td class="line-code"><pre>	#
</pre></td></tr>


<tr><th class="line-num" id="L34"><a href="#L34">34</a></th><td class="line-code"><pre>	BASE_PATH=&quot;$1&quot;
</pre></td></tr>


<tr><th class="line-num" id="L35"><a href="#L35">35</a></th><td class="line-code"><pre>	RESTRICTED_DIRS=&quot;$2&quot;
</pre></td></tr>


<tr><th class="line-num" id="L36"><a href="#L36">36</a></th><td class="line-code"><pre>	SAFE_DIRS=&quot;$3&quot;
</pre></td></tr>


<tr><th class="line-num" id="L37"><a href="#L37">37</a></th><td class="line-code"><pre>	UMASK=&quot;$4&quot;
</pre></td></tr>


<tr><th class="line-num" id="L38"><a href="#L38">38</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L39"><a href="#L39">39</a></th><td class="line-code"><pre>	if [ -z &quot;${ONE_LOCATION}&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L40"><a href="#L40">40</a></th><td class="line-code"><pre>	    VAR_LOCATION=/var/lib/one/
</pre></td></tr>


<tr><th class="line-num" id="L41"><a href="#L41">41</a></th><td class="line-code"><pre>	    ETC_LOCATION=/etc/one/
</pre></td></tr>


<tr><th class="line-num" id="L42"><a href="#L42">42</a></th><td class="line-code"><pre>	else
</pre></td></tr>


<tr><th class="line-num" id="L43"><a href="#L43">43</a></th><td class="line-code"><pre>	    VAR_LOCATION=$ONE_LOCATION/var/
</pre></td></tr>


<tr><th class="line-num" id="L44"><a href="#L44">44</a></th><td class="line-code"><pre>	    ETC_LOCATION=$ONE_LOCATION/etc/
</pre></td></tr>


<tr><th class="line-num" id="L45"><a href="#L45">45</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L46"><a href="#L46">46</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L47"><a href="#L47">47</a></th><td class="line-code"><pre>	#
</pre></td></tr>


<tr><th class="line-num" id="L48"><a href="#L48">48</a></th><td class="line-code"><pre>	# RESTRICTED AND SAFE DIRS (from default configuration)
</pre></td></tr>


<tr><th class="line-num" id="L49"><a href="#L49">49</a></th><td class="line-code"><pre>	#
</pre></td></tr>


<tr><th class="line-num" id="L50"><a href="#L50">50</a></th><td class="line-code"><pre>	RESTRICTED_DIRS=&quot;$VAR_LOCATION $ETC_LOCATION $HOME/ $RESTRICTED_DIRS&quot;
</pre></td></tr>


<tr><th class="line-num" id="L51"><a href="#L51">51</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L52"><a href="#L52">52</a></th><td class="line-code"><pre>	export BASE_PATH
</pre></td></tr>


<tr><th class="line-num" id="L53"><a href="#L53">53</a></th><td class="line-code"><pre>	export RESTRICTED_DIRS
</pre></td></tr>


<tr><th class="line-num" id="L54"><a href="#L54">54</a></th><td class="line-code"><pre>	export SAFE_DIRS
</pre></td></tr>


<tr><th class="line-num" id="L55"><a href="#L55">55</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L56"><a href="#L56">56</a></th><td class="line-code"><pre>	if [ -n &quot;$UMASK&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L57"><a href="#L57">57</a></th><td class="line-code"><pre>		umask $UMASK
</pre></td></tr>


<tr><th class="line-num" id="L58"><a href="#L58">58</a></th><td class="line-code"><pre>	else
</pre></td></tr>


<tr><th class="line-num" id="L59"><a href="#L59">59</a></th><td class="line-code"><pre>		umask 0007
</pre></td></tr>


<tr><th class="line-num" id="L60"><a href="#L60">60</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L61"><a href="#L61">61</a></th><td class="line-code"><pre>}
</pre></td></tr>


<tr><th class="line-num" id="L62"><a href="#L62">62</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L63"><a href="#L63">63</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L64"><a href="#L64">64</a></th><td class="line-code"><pre># Generates an unique image path. Requires BASE_PATH to be set
</pre></td></tr>


<tr><th class="line-num" id="L65"><a href="#L65">65</a></th><td class="line-code"><pre>#   @return path for the image (empty if error)
</pre></td></tr>


<tr><th class="line-num" id="L66"><a href="#L66">66</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L67"><a href="#L67">67</a></th><td class="line-code"><pre>function generate_image_path {
</pre></td></tr>


<tr><th class="line-num" id="L68"><a href="#L68">68</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L69"><a href="#L69">69</a></th><td class="line-code"><pre>	CANONICAL_STR=&quot;`$DATE +%s`:$ID&quot;
</pre></td></tr>


<tr><th class="line-num" id="L70"><a href="#L70">70</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L71"><a href="#L71">71</a></th><td class="line-code"><pre>	CANONICAL_MD5=$($MD5SUM - &lt;&lt; EOF
</pre></td></tr>


<tr><th class="line-num" id="L72"><a href="#L72">72</a></th><td class="line-code"><pre>$CANONICAL_STR
</pre></td></tr>


<tr><th class="line-num" id="L73"><a href="#L73">73</a></th><td class="line-code"><pre>EOF
</pre></td></tr>


<tr><th class="line-num" id="L74"><a href="#L74">74</a></th><td class="line-code"><pre>)
</pre></td></tr>


<tr><th class="line-num" id="L75"><a href="#L75">75</a></th><td class="line-code"><pre>	IMAGE_HASH=$(echo $CANONICAL_MD5 | cut -d ' ' -f1)
</pre></td></tr>


<tr><th class="line-num" id="L76"><a href="#L76">76</a></th><td class="line-code"><pre>	IMAGE_HASH=$(basename &quot;$IMAGE_HASH&quot;)
</pre></td></tr>


<tr><th class="line-num" id="L77"><a href="#L77">77</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L78"><a href="#L78">78</a></th><td class="line-code"><pre>	if [ -z &quot;$IMAGE_HASH&quot; -o -z &quot;$BASE_PATH&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L79"><a href="#L79">79</a></th><td class="line-code"><pre>		log_error &quot;Error generating the path in generate_image_path.&quot;
</pre></td></tr>


<tr><th class="line-num" id="L80"><a href="#L80">80</a></th><td class="line-code"><pre>		exit 1
</pre></td></tr>


<tr><th class="line-num" id="L81"><a href="#L81">81</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L82"><a href="#L82">82</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L83"><a href="#L83">83</a></th><td class="line-code"><pre>	echo &quot;${BASE_PATH}/${IMAGE_HASH}&quot;
</pre></td></tr>


<tr><th class="line-num" id="L84"><a href="#L84">84</a></th><td class="line-code"><pre>}
</pre></td></tr>


<tr><th class="line-num" id="L85"><a href="#L85">85</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L86"><a href="#L86">86</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L87"><a href="#L87">87</a></th><td class="line-code"><pre># Set up the arguments for the downloader script
</pre></td></tr>


<tr><th class="line-num" id="L88"><a href="#L88">88</a></th><td class="line-code"><pre>#   @param $1 - MD5 string
</pre></td></tr>


<tr><th class="line-num" id="L89"><a href="#L89">89</a></th><td class="line-code"><pre>#   @param $2 - SHA1 string
</pre></td></tr>


<tr><th class="line-num" id="L90"><a href="#L90">90</a></th><td class="line-code"><pre>#   @param $3 - NO_DECOMPRESS
</pre></td></tr>


<tr><th class="line-num" id="L91"><a href="#L91">91</a></th><td class="line-code"><pre>#   @param $4 - BW LIMIT
</pre></td></tr>


<tr><th class="line-num" id="L92"><a href="#L92">92</a></th><td class="line-code"><pre>#   @param $5 - SRC
</pre></td></tr>


<tr><th class="line-num" id="L93"><a href="#L93">93</a></th><td class="line-code"><pre>#   @param $6 - DST
</pre></td></tr>


<tr><th class="line-num" id="L94"><a href="#L94">94</a></th><td class="line-code"><pre>#   @return downloader.sh util arguments
</pre></td></tr>


<tr><th class="line-num" id="L95"><a href="#L95">95</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L96"><a href="#L96">96</a></th><td class="line-code"><pre>function set_downloader_args {
</pre></td></tr>


<tr><th class="line-num" id="L97"><a href="#L97">97</a></th><td class="line-code"><pre>	HASHES=&quot; &quot;
</pre></td></tr>


<tr><th class="line-num" id="L98"><a href="#L98">98</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L99"><a href="#L99">99</a></th><td class="line-code"><pre>	if [ -n &quot;$1&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L100"><a href="#L100">100</a></th><td class="line-code"><pre>	    HASHES=&quot;--md5 $1&quot;
</pre></td></tr>


<tr><th class="line-num" id="L101"><a href="#L101">101</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L102"><a href="#L102">102</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L103"><a href="#L103">103</a></th><td class="line-code"><pre>	if [ -n &quot;$2&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L104"><a href="#L104">104</a></th><td class="line-code"><pre>	    HASHES=&quot;$HASHES --sha1 $2&quot;
</pre></td></tr>


<tr><th class="line-num" id="L105"><a href="#L105">105</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L106"><a href="#L106">106</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L107"><a href="#L107">107</a></th><td class="line-code"><pre>	if [ &quot;$3&quot; = &quot;yes&quot; -o &quot;$3&quot; = &quot;Yes&quot; -o &quot;$3&quot; = &quot;YES&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L108"><a href="#L108">108</a></th><td class="line-code"><pre>	    HASHES=&quot;$HASHES --nodecomp&quot;
</pre></td></tr>


<tr><th class="line-num" id="L109"><a href="#L109">109</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L110"><a href="#L110">110</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L111"><a href="#L111">111</a></th><td class="line-code"><pre>	if [ -n &quot;$4&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L112"><a href="#L112">112</a></th><td class="line-code"><pre>		HASHES=&quot;$HASHES --limit $4&quot;
</pre></td></tr>


<tr><th class="line-num" id="L113"><a href="#L113">113</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L114"><a href="#L114">114</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L115"><a href="#L115">115</a></th><td class="line-code"><pre>	echo &quot;$HASHES $5 $6&quot;
</pre></td></tr>


<tr><th class="line-num" id="L116"><a href="#L116">116</a></th><td class="line-code"><pre>}
</pre></td></tr>


<tr><th class="line-num" id="L117"><a href="#L117">117</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L118"><a href="#L118">118</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L119"><a href="#L119">119</a></th><td class="line-code"><pre># Computes the size of an image
</pre></td></tr>


<tr><th class="line-num" id="L120"><a href="#L120">120</a></th><td class="line-code"><pre>#   @param $1 - Path to the image
</pre></td></tr>


<tr><th class="line-num" id="L121"><a href="#L121">121</a></th><td class="line-code"><pre>#   @return size of the image in Mb
</pre></td></tr>


<tr><th class="line-num" id="L122"><a href="#L122">122</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L123"><a href="#L123">123</a></th><td class="line-code"><pre>function fs_size {
</pre></td></tr>


<tr><th class="line-num" id="L124"><a href="#L124">124</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L125"><a href="#L125">125</a></th><td class="line-code"><pre>	case $1 in
</pre></td></tr>


<tr><th class="line-num" id="L126"><a href="#L126">126</a></th><td class="line-code"><pre>	http://*/download|https://*/download)
</pre></td></tr>


<tr><th class="line-num" id="L127"><a href="#L127">127</a></th><td class="line-code"><pre>		BASE_URL=${1%%/download}
</pre></td></tr>


<tr><th class="line-num" id="L128"><a href="#L128">128</a></th><td class="line-code"><pre>		HEADERS=`wget -S --spider --no-check-certificate $BASE_URL 2&gt;&amp;1`
</pre></td></tr>


<tr><th class="line-num" id="L129"><a href="#L129">129</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L130"><a href="#L130">130</a></th><td class="line-code"><pre>		echo $HEADERS | grep &quot;market&quot; &gt; /dev/null 2&gt;&amp;1
</pre></td></tr>


<tr><th class="line-num" id="L131"><a href="#L131">131</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L132"><a href="#L132">132</a></th><td class="line-code"><pre>		if [ $? -eq 0 ]; then
</pre></td></tr>


<tr><th class="line-num" id="L133"><a href="#L133">133</a></th><td class="line-code"><pre>			#URL is from market place
</pre></td></tr>


<tr><th class="line-num" id="L134"><a href="#L134">134</a></th><td class="line-code"><pre>			SIZE=`wget -O - -S --no-check-certificate $BASE_URL 2&gt;&amp;1|grep -E &quot;^ *\&quot;size\&quot;: \&quot;?[0-9]+\&quot;?.$&quot;|tr -dc 0-9`
</pre></td></tr>


<tr><th class="line-num" id="L135"><a href="#L135">135</a></th><td class="line-code"><pre>		else
</pre></td></tr>


<tr><th class="line-num" id="L136"><a href="#L136">136</a></th><td class="line-code"><pre>			#Not a marketplace URL
</pre></td></tr>


<tr><th class="line-num" id="L137"><a href="#L137">137</a></th><td class="line-code"><pre>			SIZE=`wget -S --spider --no-check-certificate $1 2&gt;&amp;1 | grep Content-Length  | cut -d':' -f2`
</pre></td></tr>


<tr><th class="line-num" id="L138"><a href="#L138">138</a></th><td class="line-code"><pre>		fi
</pre></td></tr>


<tr><th class="line-num" id="L139"><a href="#L139">139</a></th><td class="line-code"><pre>		error=$?
</pre></td></tr>


<tr><th class="line-num" id="L140"><a href="#L140">140</a></th><td class="line-code"><pre>	    ;;
</pre></td></tr>


<tr><th class="line-num" id="L141"><a href="#L141">141</a></th><td class="line-code"><pre>	http://*|https://*)
</pre></td></tr>


<tr><th class="line-num" id="L142"><a href="#L142">142</a></th><td class="line-code"><pre>		SIZE=`wget -S --spider --no-check-certificate $1 2&gt;&amp;1 | grep Content-Length  | cut -d':' -f2`
</pre></td></tr>


<tr><th class="line-num" id="L143"><a href="#L143">143</a></th><td class="line-code"><pre>		error=$?
</pre></td></tr>


<tr><th class="line-num" id="L144"><a href="#L144">144</a></th><td class="line-code"><pre>	    ;;
</pre></td></tr>


<tr><th class="line-num" id="L145"><a href="#L145">145</a></th><td class="line-code"><pre>	*)
</pre></td></tr>


<tr><th class="line-num" id="L146"><a href="#L146">146</a></th><td class="line-code"><pre>		if [ -d &quot;$1&quot; ]; then
</pre></td></tr>


<tr><th class="line-num" id="L147"><a href="#L147">147</a></th><td class="line-code"><pre>			SIZE=`du -sb &quot;$1&quot; | cut -f1`
</pre></td></tr>


<tr><th class="line-num" id="L148"><a href="#L148">148</a></th><td class="line-code"><pre>			error=$?
</pre></td></tr>


<tr><th class="line-num" id="L149"><a href="#L149">149</a></th><td class="line-code"><pre>		else
</pre></td></tr>


<tr><th class="line-num" id="L150"><a href="#L150">150</a></th><td class="line-code"><pre>			SIZE=`stat -c %s &quot;$1&quot;`
</pre></td></tr>


<tr><th class="line-num" id="L151"><a href="#L151">151</a></th><td class="line-code"><pre>			error=$?
</pre></td></tr>


<tr><th class="line-num" id="L152"><a href="#L152">152</a></th><td class="line-code"><pre>		fi
</pre></td></tr>


<tr><th class="line-num" id="L153"><a href="#L153">153</a></th><td class="line-code"><pre>		;;
</pre></td></tr>


<tr><th class="line-num" id="L154"><a href="#L154">154</a></th><td class="line-code"><pre>	esac
</pre></td></tr>


<tr><th class="line-num" id="L155"><a href="#L155">155</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L156"><a href="#L156">156</a></th><td class="line-code"><pre>	if [ $error -ne 0 ]; then
</pre></td></tr>


<tr><th class="line-num" id="L157"><a href="#L157">157</a></th><td class="line-code"><pre>		SIZE=0
</pre></td></tr>


<tr><th class="line-num" id="L158"><a href="#L158">158</a></th><td class="line-code"><pre>	else
</pre></td></tr>


<tr><th class="line-num" id="L159"><a href="#L159">159</a></th><td class="line-code"><pre>		SIZE=$((($SIZE+1048575)/1048576))
</pre></td></tr>


<tr><th class="line-num" id="L160"><a href="#L160">160</a></th><td class="line-code"><pre>	fi
</pre></td></tr>


<tr><th class="line-num" id="L161"><a href="#L161">161</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L162"><a href="#L162">162</a></th><td class="line-code"><pre>	echo &quot;$SIZE&quot;
</pre></td></tr>


<tr><th class="line-num" id="L163"><a href="#L163">163</a></th><td class="line-code"><pre>}
</pre></td></tr>


<tr><th class="line-num" id="L164"><a href="#L164">164</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L165"><a href="#L165">165</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L166"><a href="#L166">166</a></th><td class="line-code"><pre># Checks if a path is safe for copying the image from
</pre></td></tr>


<tr><th class="line-num" id="L167"><a href="#L167">167</a></th><td class="line-code"><pre>#   @param $1 - Path to the image
</pre></td></tr>


<tr><th class="line-num" id="L168"><a href="#L168">168</a></th><td class="line-code"><pre>#   @return 0 if the path is safe, 1 otherwise
</pre></td></tr>


<tr><th class="line-num" id="L169"><a href="#L169">169</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L170"><a href="#L170">170</a></th><td class="line-code"><pre>function check_restricted {
</pre></td></tr>


<tr><th class="line-num" id="L171"><a href="#L171">171</a></th><td class="line-code"><pre>	for path in $SAFE_DIRS ; do
</pre></td></tr>


<tr><th class="line-num" id="L172"><a href="#L172">172</a></th><td class="line-code"><pre>		if [ -n &quot;`readlink -f $1 | grep -E &quot;^$path&quot;`&quot; ] ; then
</pre></td></tr>


<tr><th class="line-num" id="L173"><a href="#L173">173</a></th><td class="line-code"><pre>			echo 0
</pre></td></tr>


<tr><th class="line-num" id="L174"><a href="#L174">174</a></th><td class="line-code"><pre>			return
</pre></td></tr>


<tr><th class="line-num" id="L175"><a href="#L175">175</a></th><td class="line-code"><pre>		fi
</pre></td></tr>


<tr><th class="line-num" id="L176"><a href="#L176">176</a></th><td class="line-code"><pre>	done
</pre></td></tr>


<tr><th class="line-num" id="L177"><a href="#L177">177</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L178"><a href="#L178">178</a></th><td class="line-code"><pre>	for path in $RESTRICTED_DIRS ; do
</pre></td></tr>


<tr><th class="line-num" id="L179"><a href="#L179">179</a></th><td class="line-code"><pre>		if [ -n &quot;`readlink -f $1 | grep -E &quot;^$path&quot;`&quot; ] ; then
</pre></td></tr>


<tr><th class="line-num" id="L180"><a href="#L180">180</a></th><td class="line-code"><pre>			echo 1
</pre></td></tr>


<tr><th class="line-num" id="L181"><a href="#L181">181</a></th><td class="line-code"><pre>			return
</pre></td></tr>


<tr><th class="line-num" id="L182"><a href="#L182">182</a></th><td class="line-code"><pre>		fi
</pre></td></tr>


<tr><th class="line-num" id="L183"><a href="#L183">183</a></th><td class="line-code"><pre>    done
</pre></td></tr>


<tr><th class="line-num" id="L184"><a href="#L184">184</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L185"><a href="#L185">185</a></th><td class="line-code"><pre>  	echo 0
</pre></td></tr>


<tr><th class="line-num" id="L186"><a href="#L186">186</a></th><td class="line-code"><pre>}
</pre></td></tr>


<tr><th class="line-num" id="L187"><a href="#L187">187</a></th><td class="line-code"><pre>
</pre></td></tr>


<tr><th class="line-num" id="L188"><a href="#L188">188</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L189"><a href="#L189">189</a></th><td class="line-code"><pre># Gets the ESX host to be used as bridge to register a VMware disk
</pre></td></tr>


<tr><th class="line-num" id="L190"><a href="#L190">190</a></th><td class="line-code"><pre># Implements a round robin for the bridges
</pre></td></tr>


<tr><th class="line-num" id="L191"><a href="#L191">191</a></th><td class="line-code"><pre>#   @param $1 - Path to the list of ESX hosts to be used as bridges
</pre></td></tr>


<tr><th class="line-num" id="L192"><a href="#L192">192</a></th><td class="line-code"><pre>#   @return host to be used as bridge
</pre></td></tr>


<tr><th class="line-num" id="L193"><a href="#L193">193</a></th><td class="line-code"><pre>#-------------------------------------------------------------------------------
</pre></td></tr>


<tr><th class="line-num" id="L194"><a href="#L194">194</a></th><td class="line-code"><pre>function get_destination_host {
</pre></td></tr>


<tr><th class="line-num" id="L195"><a href="#L195">195</a></th><td class="line-code"><pre>	HOSTS_ARRAY=($BRIDGE_LIST)
</pre></td></tr>


<tr><th class="line-num" id="L196"><a href="#L196">196</a></th><td class="line-code"><pre>    ARRAY_INDEX=`expr $1 % ${#HOSTS_ARRAY[@]}`
</pre></td></tr>


<tr><th class="line-num" id="L197"><a href="#L197">197</a></th><td class="line-code"><pre>	echo ${HOSTS_ARRAY[$ARRAY_INDEX]}
</pre></td></tr>


<tr><th class="line-num" id="L198"><a href="#L198">198</a></th><td class="line-code"><pre>}
</pre></td></tr>


</tbody>
</table>
</div>




        
				<div style="clear:both;"></div>
    </div>
</div>

<div id="ajax-indicator" style="display:none;"><span>Loading...</span></div>
	
<div id="footer">
  <div class="bgl"><div class="bgr">
    Powered by <a href="http://www.redmine.org/">Redmine</a> &copy; 2006-2011 Jean-Philippe Lang
  </div></div>
</div>
</div>
</div>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-9914544-2");
pageTracker._trackPageview();
} catch(err) {}</script>
</body>
</html>
