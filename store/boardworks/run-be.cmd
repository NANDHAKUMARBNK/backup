@ECHO OFF

SET SRCDIR=%~dp0
SET PROJ=%SRCDIR%..\..\..\..\BWApi\BoardWorks.BWApi.Api\BoardWorks.BWApi.Api.csproj

dotnet run -p "%PROJ%" --launch-profile Angular --force
