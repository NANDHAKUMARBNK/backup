@ECHO OFF

SET SRCDIR=%~dp0
SET PROJ=%SRCDIR%..\BoardWorks.UI.Portal.Web.csproj

dotnet run -p "%PROJ%" --launch-profile Angular --force
